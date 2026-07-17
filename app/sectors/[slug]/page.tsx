import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DataTable from '@/components/DataTable';
import RangeControls from '@/components/RangeControls';
import SourceFooter from '@/components/SourceFooter';
import TrendAreaChart from '@/components/charts/TrendAreaChart';
import { formatShare, formatUsd, fyLabel } from '@/lib/format';
import { parseRange, type RawSearchParams } from '@/lib/params';
import { getOutlayFunction, getOutlayTotals, getSourceMeta, getYearBounds } from '@/lib/queries';
import { sectorBySlug } from '@/lib/sectors';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sector = sectorBySlug.get((await params).slug);
  return sector
    ? { title: sector.name, description: sector.description }
    : { title: 'Sector not found' };
}

export default async function SectorPage({ params, searchParams }: PageProps) {
  const sector = sectorBySlug.get((await params).slug);
  if (!sector) notFound();

  const bounds = await getYearBounds('outlay');
  const range = parseRange(await searchParams, bounds, {
    from: bounds.min,
    to: bounds.latestActual,
  });
  const { from, to, unit } = range;

  const [points, totals, source] = await Promise.all([
    getOutlayFunction(sector.functionCode, from, to),
    getOutlayTotals(from, to),
    getSourceMeta('outlay'),
  ]);

  const totalByYear = new Map(totals.map((t) => [t.fiscalYear, t.amount]));
  const rows = points.map((p) => ({
    year: p.fiscalYear,
    isProjection: p.isProjection,
    value:
      unit === 'usd'
        ? p.amount
        : (p.amount / (totalByYear.get(p.fiscalYear) ?? Infinity)) * 100 || 0,
  }));

  const latestActualPoint = [...points].reverse().find((p) => !p.isProjection) ?? points.at(-1);
  const latestShare = latestActualPoint
    ? latestActualPoint.amount / (totalByYear.get(latestActualPoint.fiscalYear) ?? Infinity)
    : null;

  const tableSeries = [
    {
      key: 'v',
      label: unit === 'usd' ? 'Outlays' : '% of total outlays',
      color: 'var(--viz-series-1)',
    },
  ];
  const tableRows = rows.map((r) => ({
    year: r.year,
    isProjection: r.isProjection,
    values: { v: r.value },
  }));

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ink/60">
        <Link href="/" className="hover:text-accent hover:underline">
          Federal
        </Link>
        {' › '}
        <Link href="/federal/spending" className="hover:text-accent hover:underline">
          Spending
        </Link>
        {' › '}
        <span className="text-ink">{sector.name}</span>
      </nav>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">{sector.name}</h1>
        <p className="max-w-2xl text-lg text-ink/80">{sector.description}</p>
        {latestActualPoint && (
          <p className="text-ink/80">
            {fyLabel(latestActualPoint.fiscalYear)}:{' '}
            <strong className="tabular-nums">{formatUsd(latestActualPoint.amount)}</strong>
            {latestShare !== null && (
              <span className="text-ink/60">
                {' '}
                — {formatShare(latestShare)} of total federal outlays
              </span>
            )}
          </p>
        )}
      </header>

      <section className="grid gap-3 rounded-lg border border-ink/10 bg-white p-4 text-sm sm:grid-cols-2">
        <div>
          <h2 className="font-semibold">What this includes</h2>
          <p className="mt-1 text-ink/70">{sector.includes}</p>
        </div>
        <div>
          <h2 className="font-semibold">What this excludes</h2>
          <p className="mt-1 text-ink/70">{sector.excludes}</p>
        </div>
      </section>

      <RangeControls
        min={bounds.min}
        max={bounds.max}
        from={from}
        to={to}
        unit={unit}
        shareLabel="% of outlays"
      />

      <section className="space-y-2">
        <TrendAreaChart
          rows={rows}
          unit={unit}
          seriesLabel={sector.name}
          ariaLabel={`${sector.name} federal outlays, ${fyLabel(from)} to ${fyLabel(to)}, ${
            unit === 'usd' ? 'nominal dollars' : 'percent of total outlays'
          }`}
        />
        <DataTable
          caption={`${sector.name} outlays, ${fyLabel(from)}–${fyLabel(to)}`}
          series={tableSeries}
          rows={tableRows}
          unit={unit}
        />
        <SourceFooter source={source} />
      </section>
    </div>
  );
}
