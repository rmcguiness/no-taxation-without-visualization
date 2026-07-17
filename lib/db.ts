import postgres from 'postgres';

// Same default as ingest/load/db.py — the local docker-compose Postgres.
const DEFAULT_DATABASE_URL = 'postgresql://ntwv:ntwv_dev_password@localhost:5432/ntwv';

// Reuse one connection pool across hot reloads in dev.
const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

export const sql =
  globalForDb.sql ??
  postgres(process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL, {
    max: 5,
    idle_timeout: 30,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.sql = sql;
