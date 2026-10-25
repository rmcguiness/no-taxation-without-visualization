export default function EmptyState() {
  return (
    <div
      role="status"
      className="rounded-lg border border-dashed border-ink/20 bg-surface px-6 py-12 text-center"
    >
      <p className="font-semibold">No rows in this range</p>
      <p className="mt-2 text-sm text-muted">
        Try a different fiscal year range to explore the available data.
      </p>
    </div>
  );
}
