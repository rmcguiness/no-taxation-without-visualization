import type { Metadata } from 'next';
import Link from 'next/link';
import DataTable from '@/components/DataTable';
import RangeControls from '@/components/RangeControls';
import SourceFooter from '@/components/SourceFooter';
import CategoryBarChart from '@/components/charts/CategoryBarChart';
import StackedAreaChart from '@/components/charts/StackedAreaChart';
import { formatUsd, fyLabel } from '@/lib/format';
import { parseRange, type RawSearchParams } from '@/lib/params';
import { getOutlayFunctions, getOutlayTotals, getSourceMeta, getYearBounds } from '@/lib/queries';
import { sectorByCode, SECTORS } from '@/lib/sectors';
import { pivotByYear, spendingSeries, toShareOfTotal, totalsMap } from '@/lib/shape';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Federal spending',
  description: 'Federal outlays by budget function, from OMB Historical Table 3.2.',
};

export default async function SpendingPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const bounds = await getYearBounds('outlay');
  const params = await searchParams;
  const { from, to, unit } = parseRange(params, bounds, {
    from: Math.max(bounds.min, bounds.latestActual - 30),
    to: bounds.latestActual,
  });

  const [functions, totals, source] = await Promise.all([
    getOutlayFunctions(from, to),
    getOutlayTotals(from, to),
    getSourceMeta('outlay'),
  ]);

  const endYearPoints = functions.filter((p) => p.fiscalYear === to);
  const barData = [...endYearPoints]
    .sort((a, b) => b.amount - a.amount)
    .map((p) => ({
      label: sectorByCode.get(p.categoryCode)?.name ?? p.categoryName,
      value: p.amount,
    }));
  const endTotal = totals.find((t) => t.fiscalYear === to);

  const usdRows = pivotByYear(functions);
  const { series, rows: foldedUsdRows } = spendingSeries(
    usdRows,
    Math.min(bounds.latestActual, to),
  );
  const areaRows =
    unit === 'share' ? toShareOfTotal(foldedUsdRows, totalsMap(totals)) : foldedUsdRows;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Federal spending</h1>
        <p className="max-w-2xl text-ink/70">
          <strong>What this is:</strong> federal <em>outlays</em> — cash actually spent, by budget
          function, for fiscal years ending September 30. Grants to states appear here on the
          federal side; state budgets count them again as their own revenue, which is why we never
          add the layers together.
        </p>
        {endTotal && (
          <p className="text-lg">
            {fyLabel(to)} total outlays:{' '}
            <strong className="tabular-nums">{formatUsd(endTotal.amount)}</strong>
            {endTotal.isProjection && (
              <span className="ml-2 text-sm text-ink/60">(OMB estimate)</span>
            )}
          </p>
        )}
      </header>

      <RangeControls min={bounds.min} max={bounds.max} from={from} to={to} unit={unit} />

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">All sectors in {fyLabel(to)}</h2>
        <p className="text-sm text-ink/60">
          &ldquo;Undistributed offsetting receipts&rdquo; is negative by design — collections
          counted against total spending. Click any sector below the chart for its story.
        </p>
        <CategoryBarChart
          data={barData}
          ariaLabel={`Federal outlays by budget function in ${fyLabel(to)}`}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          How the mix changed, {fyLabel(from)}–{fyLabel(to)}
        </h2>
        <p className="text-sm text-ink/60">
          Largest seven sectors; the rest fold into &ldquo;Everything else.&rdquo;
        </p>
        <StackedAreaChart
          rows={areaRows}
          series={series}
          unit={unit}
          ariaLabel={`Federal outlays for the largest budget functions, ${fyLabel(from)} to ${fyLabel(
            to,
          )}, ${unit === 'usd' ? 'nominal dollars' : 'percent of total outlays'}`}
        />
        <DataTable
          caption={`Federal outlays by major function, ${fyLabel(from)}–${fyLabel(to)}`}
          series={series}
          rows={areaRows}
          unit={unit}
        />
        <SourceFooter source={source} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Sector pages</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s) => (
            <li key={s.slug}>
              <Link href={`/sectors/${s.slug}`} className="text-accent hover:underline">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
