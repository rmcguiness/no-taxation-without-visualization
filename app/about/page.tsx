import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'What No Taxation without Visualization is, and what it does and does not claim.',
};

export default function AboutPage() {
  return (
    <article className="prose-headings:tracking-tight max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">About</h1>
      <p>
        <strong>No Taxation without Visualization</strong> helps Americans see where public money
        comes from and where it goes, understand which level of government decides it — federal,
        state, or local — and take part in the meetings and elections that control the checkbook.
      </p>
      <h2 className="text-xl font-semibold">What we claim — and what we don&apos;t</h2>
      <ul className="list-disc space-y-2 pl-6">
        <li>
          Every number we publish cites an authoritative public source and the date it was
          retrieved.
        </li>
        <li>
          We report published totals and whether they reconcile across sources. We do not label
          anything &ldquo;fraud&rdquo; or &ldquo;theft.&rdquo; Where data looks unusual or
          incomplete, we say <em>needs review</em> or <em>data gap</em> — nothing stronger.
        </li>
        <li>
          Balanced books do not prove the absence of fraud, and gaps do not prove theft. We show
          what the public record supports, no more.
        </li>
        <li>We are nonpartisan: no endorsements, no vote recommendations, no party coding.</li>
      </ul>
      <p>
        When something in the data looks odd, the strongest language we use is one of these labels —
        never an accusation:
      </p>
      <p className="flex flex-wrap gap-2 text-sm">
        {['Needs review', 'Unusual pattern', 'Data gap', 'Outlier vs peers'].map((label) => (
          <span key={label} className="rounded-full border border-ink/20 px-3 py-1 text-ink/70">
            {label}
          </span>
        ))}
      </p>
      <p className="text-ink/70">
        This site is under active construction. The federal revenue and spending story arrives in
        Phase 1.
      </p>
    </article>
  );
}
