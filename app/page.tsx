import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="flex flex-col items-start gap-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        No Taxation without Visualization
      </h1>
      <p className="max-w-2xl text-lg text-ink/80">
        See where U.S. public money comes from, where it goes, and which government decides — one
        clearly sourced chart at a time.
      </p>
      <p className="max-w-2xl text-ink/70">
        We are building the federal money map first: receipts by source and outlays by function,
        every number with a citation and an as-of date. Charts are coming in Phase 1.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/about"
          className="rounded-md bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-dark focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        >
          What this is
        </Link>
        <Link
          href="/methodology"
          className="rounded-md border border-ink/20 px-5 py-2.5 font-medium hover:border-accent hover:text-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent"
        >
          How we count
        </Link>
      </div>
    </section>
  );
}
