"""Postgres loader.

Idempotency contract (docs/ARCHITECTURE.md §6.3): re-running ingest for the
same content_hash must not duplicate series rows. Implementation: snapshots
are unique per (data_source_id, content_hash); loading a snapshot deletes and
re-inserts its rows inside one transaction, so repeat runs converge to the
same state. New vintages (new hash) become new snapshots; the
fiscal_series_latest view serves only the newest snapshot per source.
"""

from __future__ import annotations

import os
from pathlib import Path

import psycopg

from sources.fetch import RawFile, SCHEMA_VERSION
from transforms.common import SeriesRow

DEFAULT_DATABASE_URL = "postgresql://ntwv:ntwv_dev_password@localhost:5432/ntwv"
SCHEMA_PATH = Path(__file__).resolve().parent.parent / "schema.sql"


def database_url() -> str:
    return os.environ.get("DATABASE_URL", DEFAULT_DATABASE_URL)


def connect(url: str | None = None) -> psycopg.Connection:
    return psycopg.connect(url or database_url())


def ensure_schema(conn: psycopg.Connection) -> None:
    conn.execute(SCHEMA_PATH.read_text())
    conn.commit()


def load_snapshot(conn: psycopg.Connection, raw: RawFile, rows: list[SeriesRow]) -> dict:
    """Register source + snapshot and (re)load its fiscal_series rows."""
    source = raw.source
    with conn.transaction():
        conn.execute(
            """
            INSERT INTO data_source (id, name, publisher, homepage_url, license, confidence, notes)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name, publisher = EXCLUDED.publisher,
              homepage_url = EXCLUDED.homepage_url, license = EXCLUDED.license,
              confidence = EXCLUDED.confidence, notes = EXCLUDED.notes
            """,
            (
                source.id,
                source.name,
                source.publisher,
                source.homepage_url,
                source.license,
                source.confidence,
                source.notes,
            ),
        )
        snapshot_id = conn.execute(
            """
            INSERT INTO dataset_snapshot
              (data_source_id, retrieved_at, content_hash, raw_uri, schema_version)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (data_source_id, content_hash) DO UPDATE
              SET raw_uri = EXCLUDED.raw_uri  -- no-op update so RETURNING yields the id
            RETURNING id
            """,
            (
                source.id,
                raw.retrieved_at,
                raw.content_hash,
                str(raw.path),
                SCHEMA_VERSION,
            ),
        ).fetchone()[0]

        conn.execute("DELETE FROM fiscal_series WHERE snapshot_id = %s", (snapshot_id,))
        with conn.cursor() as cur:
            cur.executemany(
                """
                INSERT INTO fiscal_series
                  (snapshot_id, government_level, metric, category_code, category_name,
                   parent_category_code, fiscal_year, amount, amount_unit, is_projection, notes)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """,
                [
                    (
                        snapshot_id,
                        r.government_level,
                        r.metric,
                        r.category_code,
                        r.category_name,
                        r.parent_category_code,
                        r.fiscal_year,
                        r.amount,
                        r.amount_unit,
                        r.is_projection,
                        r.notes,
                    )
                    for r in rows
                ],
            )
    return {"snapshot_id": str(snapshot_id), "rows": len(rows)}
