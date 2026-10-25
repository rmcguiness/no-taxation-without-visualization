import { pageMetadata } from '@/lib/metadata';
import DataTable from '@/components/DataTable';
import RangeControls from '@/components/RangeControls';
import SourceFooter from '@/components/SourceFooter';
import StackedAreaChart from '@/components/charts/StackedAreaChart';
import { formatUsd, fyLabel } from '@/lib/format';
import { parseRange, type RawSearchParams } from '@/lib/params';
import {
  getReceiptComponents,
  getReceiptTotals,
  getSourceMeta,
  getYearBounds,
} from '@/lib/queries';
import { pivotByYear, RECEIPT_SERIES, toShareOfTotal, totalsMap } from '@/lib/shape';

export const dynamic = 'force-dynamic';

export const metadata = pageMetadata(
  'Federal revenue',
  'Federal receipts by source, from OMB Historical Table 2.1.',
  '/federal/revenue',
);

export default async function RevenuePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const bounds = await getYearBounds('receipt');
  const params = await searchParams;
  const { from, to, unit } = parseRange(params, bounds, {
    from: Math.max(bounds.min, bounds.latestActual - 30),
    to: bounds.latestActual,
  });

  const [components, totals, source] = await Promise.all([
    getReceiptComponents(from, to),
    getReceiptTotals(from, to),
    getSourceMeta('receipt'),
  ]);

  const usdRows = pivotByYear(components);
  const rows = unit === 'share' ? toShareOfTotal(usdRows, totalsMap(totals)) : usdRows;
  const endTotal = totals.find((t) => t.fiscalYear === to);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Federal revenue</h1>
        <p className="max-w-2xl text-ink/70">
          <strong>What this is:</strong> federal <em>receipts</em> — money the U.S. government
          collected, by source, for fiscal years ending September 30. State and local taxes are
          separate and not shown here.
        </p>
        {endTotal && (
          <p className="text-lg">
            {fyLabel(to)} total receipts:{' '}
            <strong className="tabular-nums">{formatUsd(endTotal.amount)}</strong>
            {endTotal.isProjection && (
              <span className="ml-2 text-sm text-ink/60">(OMB estimate)</span>
            )}
          </p>
        )}
      </header>

      <RangeControls min={bounds.min} max={bounds.max} from={from} to={to} unit={unit} />

      <section className="space-y-2">
        <StackedAreaChart
          totals={totals}
          rows={rows}
          series={RECEIPT_SERIES}
          unit={unit}
          ariaLabel={`Federal receipts by source, ${fyLabel(from)} to ${fyLabel(to)}, ${
            unit === 'usd' ? 'nominal dollars' : 'percent of total receipts'
          }`}
        />
        <DataTable
          caption={`Federal receipts by source, ${fyLabel(from)}–${fyLabel(to)}`}
          series={RECEIPT_SERIES}
          rows={rows}
          unit={unit}
        />
        <SourceFooter source={source} />
      </section>
    </div>
  );
}
