import Link from 'next/link';
import CategoryBarChart from '@/components/charts/CategoryBarChart';
import PartToWholeBar from '@/components/PartToWholeBar';
import SourceFooter from '@/components/SourceFooter';
import { formatUsd, fyLabel } from '@/lib/format';
import {
  getOutlayFunctions,
  getOutlayTotals,
  getReceiptComponents,
  getReceiptTotals,
  getSourceMeta,
  getYearBounds,
} from '@/lib/queries';
import { sectorByCode, SECTORS } from '@/lib/sectors';
import { RECEIPT_SERIES } from '@/lib/shape';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [receiptBounds, outlayBounds] = await Promise.all([
    getYearBounds('receipt'),
    getYearBounds('outlay'),
  ]);
  const fy = Math.min(receiptBounds.latestActual, outlayBounds.latestActual);

  const [receipts, receiptTotals, outlays, outlayTotals, receiptSource, outlaySource] =
    await Promise.all([
      getReceiptComponents(fy, fy),
      getReceiptTotals(fy, fy),
      getOutlayFunctions(fy, fy),
      getOutlayTotals(fy, fy),
      getSourceMeta('receipt'),
      getSourceMeta('outlay'),
    ]);

  const receiptsIn = receiptTotals[0]?.amount ?? 0;
  const outlaysOut = outlayTotals[0]?.amount ?? 0;
  const deficit = receiptsIn - outlaysOut;

  const receiptByCode = new Map(receipts.map((p) => [p.categoryCode, p.amount]));
  const segments = RECEIPT_SERIES.map((s) => ({
    label: s.label,
    value: receiptByCode.get(s.key) ?? 0,
    color: s.color,
  }));

  const sortedFunctions = [...outlays].sort((a, b) => b.amount - a.amount);
  const topFunctions = sortedFunctions.slice(0, 8);
  const rest = sortedFunctions.slice(8).reduce((sum, p) => sum + p.amount, 0);
  const barData = [
    ...topFunctions.map((p) => ({
      label: sectorByCode.get(p.categoryCode)?.name ?? p.categoryName,
      value: p.amount,
    })),
    { label: 'Everything else', value: rest },
  ];

  const functionAmounts = new Map(outlays.map((p) => [p.categoryCode, p.amount]));

  return (
    <div className="space-y-12">
      <section className="space-y-3 pt-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Where federal money came from and went in {fyLabel(fy)}
        </h1>
        <p className="max-w-2xl text-ink/70">
          The federal government&apos;s checkbook, from official published totals. State and local
          governments are separate checkbooks — we show them separately, later.
        </p>
      </section>

      <section aria-label="Headline totals" className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Money in (receipts)</p>
          <p className="text-3xl font-bold tabular-nums">{formatUsd(receiptsIn)}</p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">Money out (outlays)</p>
          <p className="text-3xl font-bold tabular-nums">{formatUsd(outlaysOut)}</p>
        </div>
        <div className="rounded-lg border border-ink/10 bg-white p-4">
          <p className="text-sm text-ink/60">{deficit < 0 ? 'Deficit' : 'Surplus'}</p>
          <p className="text-3xl font-bold tabular-nums">{formatUsd(Math.abs(deficit))}</p>
          <p className="mt-1 text-xs text-ink/50">
            Spending {deficit < 0 ? 'exceeded' : 'was below'} receipts; the difference is borrowed.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold">Money in — {fyLabel(fy)} receipts by source</h2>
          <Link href="/federal/revenue" className="text-sm font-medium text-accent hover:underline">
            Full history →
          </Link>
        </div>
        <PartToWholeBar
          segments={segments}
          ariaLabel={`Federal receipts by source, ${fyLabel(fy)}`}
        />
        <SourceFooter source={receiptSource} />
      </section>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold">Money out — {fyLabel(fy)} spending by sector</h2>
          <Link
            href="/federal/spending"
            className="text-sm font-medium text-accent hover:underline"
          >
            All sectors &amp; history →
          </Link>
        </div>
        <CategoryBarChart
          data={barData}
          ariaLabel={`Federal outlays by budget function, ${fyLabel(fy)}, top 8 plus everything else`}
        />
        <SourceFooter source={outlaySource} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Explore a sector</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTORS.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/sectors/${s.slug}`}
                className="block h-full rounded-lg border border-ink/10 bg-white p-3 hover:border-accent focus:outline-2 focus:outline-offset-2 focus:outline-accent"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-sm text-ink/60 tabular-nums">
                    {formatUsd(functionAmounts.get(s.functionCode) ?? 0)}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-ink/60">{s.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
