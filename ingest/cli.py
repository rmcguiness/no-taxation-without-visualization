"""ntwv-ingest: fetch → transform → validate → load, per source.

Usage:
  ntwv-ingest fetch   [--source ID]      download raw files + hash (no DB needed)
  ntwv-ingest run     [--source ID]      full pipeline into Postgres
  ntwv-ingest status                     last snapshot + row counts per source

Validation failures abort before anything is written to the database.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from sources.fetch import RawFile, fetch_source, latest_raw
from sources.registry import SOURCES
from transforms.common import SeriesRow, ValidationReport
from transforms.omb_outlays import parse_outlays, validate_outlays
from transforms.omb_receipts import parse_receipts, validate_receipts

TRANSFORMS = {
    "omb_hist_2_1": (parse_receipts, validate_receipts),
    "omb_hist_3_2": (parse_outlays, validate_outlays),
}


def _source_ids(arg: str | None) -> list[str]:
    if arg is None:
        return list(SOURCES)
    if arg not in SOURCES:
        sys.exit(f"unknown source {arg!r}; known: {', '.join(SOURCES)}")
    return [arg]


def transform_and_validate(raw: RawFile) -> list[SeriesRow]:
    parse, validate = TRANSFORMS[raw.source.id]
    rows = parse(raw.path)
    report: ValidationReport = validate(rows)
    report.raise_if_failed()
    print(
        f"  {raw.source.id}: {len(rows)} rows, {report.checks} sum checks passed "
        f"(max delta ${report.max_delta_usd:,.0f})"
    )
    return rows


def cmd_fetch(args: argparse.Namespace) -> None:
    for source_id in _source_ids(args.source):
        raw = fetch_source(source_id)
        print(f"  {source_id}: {raw.path.name} sha256={raw.content_hash[:12]}… -> {raw.path}")


def cmd_run(args: argparse.Namespace) -> None:
    from load.db import connect, ensure_schema, load_snapshot

    with connect() as conn:
        ensure_schema(conn)
        for source_id in _source_ids(args.source):
            raw = fetch_source(source_id)
            rows = transform_and_validate(raw)
            result = load_snapshot(conn, raw, rows)
            print(f"  {source_id}: loaded {result['rows']} rows (snapshot {result['snapshot_id'][:8]}…)")


def cmd_status(args: argparse.Namespace) -> None:
    from load.db import connect

    with connect() as conn:
        for row in conn.execute(
            """
            SELECT ds.data_source_id, ds.retrieved_at, ds.content_hash,
                   count(fs.id) AS rows
            FROM dataset_snapshot ds
            LEFT JOIN fiscal_series fs ON fs.snapshot_id = ds.id
            GROUP BY ds.id ORDER BY ds.data_source_id, ds.retrieved_at
            """
        ):
            print(f"  {row[0]}  retrieved={row[1]:%Y-%m-%d}  hash={row[2][:12]}…  rows={row[3]}")


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(prog="ntwv-ingest", description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    for name, fn in [("fetch", cmd_fetch), ("run", cmd_run), ("status", cmd_status)]:
        p = sub.add_parser(name)
        p.add_argument("--source", help="limit to one source id")
        p.set_defaults(fn=fn)
    args = parser.parse_args(argv)
    args.fn(args)


if __name__ == "__main__":
    main()
