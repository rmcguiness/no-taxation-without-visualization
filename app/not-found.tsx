import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-5 py-16">
      <p className="text-sm font-semibold text-accent">Page not found</p>
      <h1 className="text-3xl font-bold">This page is off the books.</h1>
      <p className="text-muted">
        The link may have moved. Head back to the federal overview to pick up the trail.
      </p>
      <Link
        href="/"
        className="inline-block rounded-lg bg-accent/10 px-5 py-3 font-semibold text-accent"
      >
        Back to the overview →
      </Link>
    </div>
  );
}
