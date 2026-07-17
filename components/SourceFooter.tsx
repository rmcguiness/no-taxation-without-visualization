import type { SourceMeta } from '@/lib/queries';

const CONFIDENCE_STYLE: Record<string, string> = {
  high: 'bg-emerald-100 text-emerald-900',
  medium: 'bg-amber-100 text-amber-900',
  low: 'bg-orange-100 text-orange-900',
  incomplete: 'bg-gray-200 text-gray-700',
};

/** Required on every chart view: dataset, publisher, as-of date, confidence. */
export default function SourceFooter({ source }: { source: SourceMeta }) {
  return (
    <p className="mt-3 border-t border-ink/10 pt-2 text-xs text-ink/60">
      Source:{' '}
      <a href={source.homepageUrl} className="underline hover:text-accent">
        {source.name}
      </a>
      , {source.publisher}. Retrieved {source.asOf}. Federal fiscal years (ending Sep 30); nominal
      dollars.{' '}
      <span
        className={`ml-1 rounded-sm px-1.5 py-0.5 font-medium ${
          CONFIDENCE_STYLE[source.confidence] ?? CONFIDENCE_STYLE.incomplete
        }`}
      >
        Confidence: {source.confidence}
      </span>
    </p>
  );
}
