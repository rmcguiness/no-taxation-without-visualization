import postgres from 'postgres';

// Same default as ingest/load/db.py — the local docker-compose Postgres.
const DEFAULT_DATABASE_URL = 'postgresql://ntwv:ntwv_dev_password@localhost:5432/ntwv';

// Reuse one connection pool across hot reloads in dev.
const globalForDb = globalThis as unknown as { sql?: ReturnType<typeof postgres> };

// Production must be configured explicitly; never fall back to the dev database.
function databaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url) return url;
  // `next build` imports server modules without serving traffic; only a running
  // production server must have DATABASE_URL.
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_PHASE !== 'phase-production-build'
  ) {
    throw new Error('DATABASE_URL must be set in production');
  }
  return DEFAULT_DATABASE_URL;
}

export const sql =
  globalForDb.sql ??
  postgres(databaseUrl(), {
    max: 5,
    idle_timeout: 30,
  });

if (process.env.NODE_ENV !== 'production') globalForDb.sql = sql;
