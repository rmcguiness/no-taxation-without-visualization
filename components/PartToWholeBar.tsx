import { formatShare, formatUsd } from '@/lib/format';

export interface Segment {
  label: string;
  value: number;
  color: string;
}

/**
 * Single-year part-to-whole as a horizontal stacked bar (plain HTML/CSS —
 * accessible and server-rendered). Direct labels in the legend carry the
 * values, satisfying the low-contrast relief rule.
 */
export default function PartToWholeBar({
  segments,
  ariaLabel,
}: {
  segments: Segment[];
  ariaLabel: string;
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  return (
    <figure aria-label={ariaLabel}>
      <div className="flex h-9 w-full gap-0.5 overflow-hidden rounded-md" role="img" aria-hidden>
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ width: `${(s.value / total) * 100}%`, backgroundColor: s.color }}
            title={`${s.label}: ${formatUsd(s.value)}`}
          />
        ))}
      </div>
      <figcaption className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-baseline gap-1.5">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 shrink-0 self-center rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-ink/80">{s.label}</span>
            <span className="font-medium tabular-nums">{formatUsd(s.value)}</span>
            <span className="text-ink/50 tabular-nums">{formatShare(s.value / total)}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
