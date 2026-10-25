'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-muted">
        We couldn&apos;t load this part of the public record. Please try again in a moment.
      </p>
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
