-- Core data-layer schema (docs/ARCHITECTURE.md §4.1), Phase 1 subset.
-- Idempotent: safe to apply repeatedly.

CREATE TABLE IF NOT EXISTS data_source (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  publisher     text NOT NULL,
  homepage_url  text,
  license       text,
  confidence    text NOT NULL CHECK (confidence IN ('high', 'medium', 'low', 'incomplete')),
  notes         text
);

CREATE TABLE IF NOT EXISTS dataset_snapshot (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_source_id  text NOT NULL REFERENCES data_source (id),
  retrieved_at    timestamptz NOT NULL,
  content_hash    text NOT NULL,
  raw_uri         text NOT NULL,
  schema_version  int NOT NULL DEFAULT 1,
  UNIQUE (data_source_id, content_hash)
);

CREATE TABLE IF NOT EXISTS fiscal_series (
  id                    bigserial PRIMARY KEY,
  snapshot_id           uuid NOT NULL REFERENCES dataset_snapshot (id),
  government_level      text NOT NULL CHECK (government_level IN ('federal', 'state', 'local')),
  metric                text NOT NULL CHECK (metric IN ('receipt', 'outlay', 'deficit', 'obligation')),
  category_code         text NOT NULL,
  category_name         text NOT NULL,
  parent_category_code  text,
  fiscal_year           int NOT NULL,
  amount                numeric NOT NULL,
  amount_unit           text NOT NULL DEFAULT 'usd_nominal',
  is_projection         boolean NOT NULL DEFAULT false,
  notes                 text,
  UNIQUE (snapshot_id, metric, category_code, fiscal_year)
);

CREATE INDEX IF NOT EXISTS fiscal_series_lookup
  ON fiscal_series (metric, category_code, fiscal_year);

-- Serving view: rows from the most recently retrieved snapshot per source,
-- so re-ingests of new vintages supersede old ones without deleting lineage.
CREATE OR REPLACE VIEW fiscal_series_latest AS
SELECT fs.*, ds.data_source_id, ds.retrieved_at AS source_as_of
FROM fiscal_series fs
JOIN dataset_snapshot ds ON ds.id = fs.snapshot_id
WHERE ds.id IN (
  SELECT DISTINCT ON (data_source_id) id
  FROM dataset_snapshot
  ORDER BY data_source_id, retrieved_at DESC
);
