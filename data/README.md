# data

- `raw/` — immutable raw downloads, laid out as `raw/{source}/{date}/{filename}`. **Gitignored**; never edit or overwrite in place. Tiny test fixtures live in `ingest/tests/fixtures/` instead.
- `processed/` — optional intermediate outputs (e.g. parquet). Also gitignored.

Both directories are created by the ingest pipeline as needed.
