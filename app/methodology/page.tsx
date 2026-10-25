import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata(
  'Methodology',
  'Data sources, transforms, and confidence levels behind every number.',
  '/methodology',
);

const sources = [
  {
    id: 'omb_hist_2_1',
    name: 'OMB Historical Table 2.1 — Receipts by Source',
    publisher: 'Office of Management and Budget',
    url: 'https://www.whitehouse.gov/wp-content/uploads/2026/04/hist02z1_fy2027.xlsx',
    coverage: 'FY1934–FY2031 (FY2026 onward are estimates)',
    retrieved: '2026-07-17',
    confidence: 'High',
  },
  {
    id: 'omb_hist_3_2',
    name: 'OMB Historical Table 3.2 — Outlays by Function and Subfunction',
    publisher: 'Office of Management and Budget',
    url: 'https://www.whitehouse.gov/wp-content/uploads/2026/04/hist03z2_fy2027.xlsx',
    coverage: 'FY1962–FY2031 (FY2026 onward are estimates)',
    retrieved: '2026-07-17',
    confidence: 'High',
  },
];

export default function MethodologyPage() {
  return (
    <article className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Methodology</h1>
      <p>
        Every chart on this site will carry a source footer: the dataset, its publisher, the date we
        retrieved it, and a confidence badge. This page documents each ingested source and the
        transforms we apply, in the open.
      </p>

      <h2 className="text-xl font-semibold">Ingested sources (Phase 1)</h2>
      <p>
        Both tables come from the FY2027 President&apos;s Budget edition of the{' '}
        <a
          href="https://www.whitehouse.gov/omb/information-resources/budget/historical-tables/"
          className="text-accent underline"
        >
          OMB Historical Tables
        </a>{' '}
        (published April 2026; public domain as U.S. government works). OMB moves these files to a
        new URL each budget year; we record the exact URL, retrieval date, and a SHA-256 content
        hash for every download.
      </p>
      <ul className="list-disc space-y-3 pl-6">
        {sources.map((s) => (
          <li key={s.id}>
            <strong>{s.name}</strong> — {s.coverage}.{' '}
            <a href={s.url} className="text-accent underline break-all">
              Download (xlsx)
            </a>
            . Retrieved {s.retrieved}. Confidence: {s.confidence}.
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold">How the numbers are handled</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Source values are published in millions of dollars; we store nominal U.S. dollars. The
          federal fiscal year ends September 30.
        </li>
        <li>
          <strong>Rounding tolerance: </strong>each published line is independently rounded to the
          nearest $1&nbsp;million, so component sums can differ slightly from published totals.
          Ingestion fails unless |sum&nbsp;of&nbsp;components&nbsp;−&nbsp;published&nbsp;total|
          ≤&nbsp;max($10&nbsp;million, 0.01% of the total) for every fiscal year and every budget
          function. Observed worst case in the current vintage: $3&nbsp;million.
        </li>
        <li>
          The 1976 &ldquo;transition quarter&rdquo; (TQ) — the July–September 1976 stub period when
          the fiscal year start moved — is excluded, since it is not a fiscal year.
        </li>
        <li>
          On-budget / off-budget splits are not yet shown; we use combined totals. Two functions
          (Medicare, Social Security) have no explicit total line in Table 3.2, so their function
          series is their single subfunction, and is marked as derived.
        </li>
        <li>
          Years labeled &ldquo;estimate&rdquo; by OMB (FY2026 onward in this vintage) are flagged as
          projections and will be visually distinguished in charts.
        </li>
        <li>
          Raw downloads are stored immutably and content-hashed before any transformation;
          re-running ingestion never duplicates or silently revises data.
        </li>
      </ul>

      <p className="text-ink/70">
        The ingest pipeline, validation rules, and tests are open source in the repository&apos;s{' '}
        <code>ingest/</code> directory.
      </p>
    </article>
  );
}
