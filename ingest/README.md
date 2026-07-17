# ingest

Python package for the data pipeline: **fetch → store raw → hash → transform → validate → load**.

Phase 0 status: skeleton only. Phase 1 adds OMB Historical Tables ingestion
(receipts by source, outlays by function). See
[docs/ARCHITECTURE.md §6](../docs/ARCHITECTURE.md) and
[docs/DATA_SOURCES.md](../docs/DATA_SOURCES.md).

## Layout

```
ingest/
  sources/      # one module per data source (fetch + raw storage + snapshot registry)
  transforms/   # raw → tidy long-format tables (fiscal_series etc.)
  tests/
    fixtures/   # tiny raw-file fixtures for transform tests (tracked in git)
```

## Rules (from AGENTS.md)

- Raw downloads are immutable: stored under `data/raw/{source}/{date}/{filename}`,
  sha256-hashed, registered as a `dataset_snapshot`.
- Transforms are re-runnable and idempotent per content hash.
- Money math (category sums vs published totals) must have tests.

## Development

```bash
cd ingest
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
pytest
```
