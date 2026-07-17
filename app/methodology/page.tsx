import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Methodology',
  description: 'Data sources, transforms, and confidence levels behind every number.',
};

export default function MethodologyPage() {
  return (
    <article className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Methodology</h1>
      <p>
        Every chart on this site will carry a source footer: the dataset, its publisher, the date we
        retrieved it, and a confidence badge. This page will document each source and every
        transform we apply, in the open.
      </p>
      <h2 className="text-xl font-semibold">Planned Phase 1 sources</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          <strong>OMB Historical Tables</strong> — federal receipts by source and outlays by budget
          function, multi-decade. Publisher: Office of Management and Budget.
        </li>
        <li>
          <strong>CBO historical budget data</strong> — independent series used to cross-check OMB
          totals (reconciliation comes in a later phase).
        </li>
      </ul>
      <h2 className="text-xl font-semibold">Ground rules</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>Raw downloads are stored immutably and content-hashed before any transformation.</li>
        <li>
          Federal, state, and local money are separate layers — we never mix them without an
          explicit, documented consolidation method.
        </li>
        <li>Category sums are tested against published totals within rounding tolerance.</li>
        <li>The federal fiscal year ends September 30; every figure states its fiscal year.</li>
      </ul>
      <p className="text-ink/70">
        Detailed per-source documentation will appear here as ingestion lands in Phase 1.
      </p>
    </article>
  );
}
