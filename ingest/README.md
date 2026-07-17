# ingest

Python package for the data pipeline: **fetch → store raw → hash → transform → validate → load**.

Phase 1 status: ingests OMB Historical Tables 2.1 (receipts by source, FY1934–FY2031)
and 3.2 (outlays by function/subfunction, FY1962–FY2031) into Postgres.
See [docs/ARCHITECTURE.md §6](../docs/ARCHITECTURE.md) and
[docs/DATA_SOURCES.md](../docs/DATA_SOURCES.md).

## Usage

```bash
cd ingest
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"

ntwv-ingest fetch    # download raw xlsx + sha256 (no DB needed)
ntwv-ingest run      # full pipeline into Postgres (docker compose up first)
ntwv-ingest status   # snapshots + row counts per source
pytest               # transform + money-math + idempotency tests
```

`DATABASE_URL` defaults to the local docker-compose Postgres
(`postgresql://ntwv:ntwv_dev_password@localhost:5432/ntwv`).

## Layout

```
ingest/
  cli.py        # ntwv-ingest entry point
  schema.sql    # data_source, dataset_snapshot, fiscal_series (+ latest view)
  sources/      # registry + fetcher (raw storage, sha256, sidecar metadata)
  transforms/   # xlsx → tidy fiscal_series rows + validation
  load/         # idempotent Postgres loader
  tests/
    fixtures/   # tiny xlsx fixtures mimicking OMB layout (make_fixtures.py)
```

## Rules (from AGENTS.md)

- Raw downloads are immutable: stored under `data/raw/{source}/{date}/{filename}`,
  sha256-hashed, registered as a `dataset_snapshot`. Never overwritten.
- Re-running ingest with the same content hash reuses the snapshot and
  converges to the same rows (delete+insert per snapshot, one transaction).
- New vintages become new snapshots; the `fiscal_series_latest` view serves
  only the newest snapshot per source, preserving lineage.
- **Money math is validated on every run**: per fiscal year, receipts
  components must sum to Total Receipts; per function, subfunctions must sum
  to the function total; functions must sum to Total outlays — all within
  max($10M, 0.01% of the total), reflecting the source's per-line rounding to
  $1M. Validation failure aborts the load.
- TQ (1976 transition quarter) is excluded. On/off-budget splits are not
  ingested in Phase 1. Years OMB labels "estimate" carry `is_projection`.
