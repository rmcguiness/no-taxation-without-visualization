"""Loader idempotency against a live Postgres (skipped if unreachable).

Runs inside a rolled-back transaction so the database is left untouched.
"""

from pathlib import Path

import pytest

from sources.fetch import RawFile, sha256_file
from sources.registry import SOURCES
from transforms.omb_receipts import parse_receipts

FIXTURES = Path(__file__).parent / "fixtures"


@pytest.fixture(scope="module")
def conn():
    psycopg = pytest.importorskip("psycopg")
    from load.db import connect, ensure_schema

    try:
        connection = connect()
    except psycopg.OperationalError:
        pytest.skip("Postgres not reachable; run `docker compose up`")
    ensure_schema(connection)
    yield connection
    connection.close()


def test_same_content_hash_does_not_duplicate_rows(conn):
    from load.db import load_snapshot

    fixture = FIXTURES / "receipts_mini.xlsx"
    raw = RawFile(
        source=SOURCES["omb_hist_2_1"],
        path=fixture,
        content_hash=sha256_file(fixture),
        retrieved_at="2026-01-01T00:00:00+00:00",
    )
    rows = parse_receipts(fixture)

    with conn.transaction(force_rollback=True):
        first = load_snapshot(conn, raw, rows)
        second = load_snapshot(conn, raw, rows)
        assert first["snapshot_id"] == second["snapshot_id"]
        count = conn.execute(
            "SELECT count(*) FROM fiscal_series WHERE snapshot_id = %s",
            (first["snapshot_id"],),
        ).fetchone()[0]
        assert count == len(rows)
