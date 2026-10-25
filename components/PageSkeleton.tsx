export default function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading federal data" className="space-y-8">
      <span className="sr-only">Loading federal data…</span>
      <div aria-hidden="true" className="space-y-8 motion-safe:animate-pulse">
        <div className="h-12 w-3/4 rounded-lg bg-ink/10" />
        <div className="h-5 w-1/2 rounded bg-ink/10" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-ink/5" />
          ))}
        </div>
        <div className="h-80 rounded-lg bg-ink/5" />
      </div>
    </div>
  );
}
