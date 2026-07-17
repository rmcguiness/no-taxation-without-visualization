'use client';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const looksLikeNoData = /ntwv-ingest|ECONNREFUSED|data loaded/i.test(error.message);
  return (
    <div className="mx-auto max-w-xl space-y-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      {looksLikeNoData ? (
        <p className="text-ink/70">
          The database doesn&apos;t have data yet. Start Postgres with{' '}
          <code className="rounded bg-ink/5 px-1">docker compose up</code> and load the federal
          series with <code className="rounded bg-ink/5 px-1">ntwv-ingest run</code> (see{' '}
          <code className="rounded bg-ink/5 px-1">ingest/README.md</code>), then try again.
        </p>
      ) : (
        <p className="text-ink/70">An unexpected error occurred while loading this page.</p>
      )}
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-accent px-4 py-2 font-medium text-white hover:bg-accent-dark"
      >
        Try again
      </button>
    </div>
  );
}
