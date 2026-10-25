import { formatShare, formatUsd } from '@/lib/format';
import type { ChartUnit } from './chartTheme';
interface Entry {
  name?: string | number;
  value?: string | number | ReadonlyArray<string | number>;
  payload?: { isProjection?: boolean; total?: number };
}
export default function ChartTooltip({
  active,
  payload,
  label,
  unit = 'usd',
  projection = false,
  total,
}: {
  active?: boolean;
  payload?: readonly Entry[];
  label?: string | number;
  unit?: ChartUnit;
  projection?: boolean;
  total?: number;
}) {
  if (!active || !payload?.length) return null;
  const publishedTotal = total ?? payload[0]?.payload?.total;
  return (
    <div className="chart-tooltip">
      <p className="mb-2 font-semibold">
        {typeof label === 'number' ? `FY${label}` : label}
        {(projection || payload[0]?.payload?.isProjection) && (
          <span className="ml-2 font-normal text-muted">OMB estimate</span>
        )}
      </p>
      <ul className="space-y-1">
        {payload.map((entry, i) => (
          <li key={i} className="flex flex-wrap justify-between gap-x-5 gap-y-1">
            <span>{entry.name === 'value' ? 'Outlays' : entry.name}</span>
            <strong className="shrink-0 tabular-nums">
              {unit === 'usd'
                ? formatUsd(Number(entry.value))
                : formatShare(Number(entry.value) / 100)}
              {unit === 'usd' && publishedTotal !== undefined && publishedTotal !== 0 && (
                <span className="ml-2 font-normal text-muted">
                  ({formatShare(Number(entry.value) / publishedTotal)})
                </span>
              )}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
