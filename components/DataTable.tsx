import { formatShare, formatUsd } from '@/lib/format';
import type { SeriesDef, YearRow, ChartUnit } from '@/components/charts/chartTheme';

interface Props {
  caption: string;
  series: SeriesDef[];
  rows: YearRow[];
  unit: ChartUnit;
}

/** Accessible "View data" table behind every chart (spec §6.1: charts first,
 *  dense tables available). Also the relief channel for low-contrast hues. */
export default function DataTable({ caption, series, rows, unit }: Props) {
  const fmt = (v: number | undefined) =>
    v === undefined ? '—' : unit === 'usd' ? formatUsd(v) : formatShare(v / 100);
  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-medium text-accent hover:underline">
        View data
      </summary>
      <div className="mt-2 max-h-96 overflow-auto rounded-md border border-ink/10">
        <table className="w-full min-w-max text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead className="sticky top-0 bg-paper">
            <tr>
              <th scope="col" className="px-3 py-2 text-left font-semibold">
                Fiscal year
              </th>
              {series.map((s) => (
                <th key={s.key} scope="col" className="px-3 py-2 text-right font-semibold">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className="border-t border-ink/10">
                <th scope="row" className="px-3 py-1.5 text-left font-normal">
                  FY{r.year}
                  {r.isProjection && <span className="ml-1 text-xs text-ink/50">(est.)</span>}
                </th>
                {series.map((s) => (
                  <td key={s.key} className="px-3 py-1.5 text-right tabular-nums">
                    {fmt(r.values[s.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
