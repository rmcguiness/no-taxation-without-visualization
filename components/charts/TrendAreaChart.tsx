'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatUsd } from '@/lib/format';
import ChartTooltip from './ChartTooltip';
import { useReducedMotion } from './useReducedMotion';
import EmptyState from '@/components/EmptyState';
import { axisTick, type ChartUnit } from './chartTheme';

interface Props {
  rows: Array<{ year: number; value: number; isProjection: boolean }>;
  unit: ChartUnit;
  ariaLabel: string;
  seriesLabel: string;
  height?: number;
  totals?: Array<{ fiscalYear: number; amount: number }>;
}

export default function TrendAreaChart({
  rows,
  unit,
  ariaLabel,
  seriesLabel,
  height = 300,
  totals,
}: Props) {
  const reducedMotion = useReducedMotion();
  const totalByYear = new Map(totals?.map((t) => [t.fiscalYear, t.amount]));
  const data = rows.map((r) => ({ ...r, total: totalByYear.get(r.year) }));
  const projectionFrom = rows.find((r) => r.isProjection)?.year;
  const lastYear = rows.at(-1)?.year;
  const hasNegative = rows.some((r) => r.value < 0);

  if (!rows.length) return <EmptyState />;
  return (
    <figure aria-label={ariaLabel} role="img">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid stroke="var(--viz-grid)" strokeDasharray="3 5" vertical={false} />
          <XAxis
            dataKey="year"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: 'var(--viz-baseline)' }}
            minTickGap={36}
          />
          <YAxis
            tickFormatter={(v: number) => (unit === 'usd' ? formatUsd(v) : `${v}%`)}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip content={<ChartTooltip unit={unit} />} />
          {projectionFrom !== undefined && lastYear !== undefined && (
            <ReferenceArea
              x1={projectionFrom}
              x2={lastYear}
              fill="var(--viz-projection-wash)"
              stroke="none"
            />
          )}
          {hasNegative && <ReferenceLine y={0} stroke="var(--viz-baseline)" />}
          <Area
            dataKey="value"
            name={seriesLabel}
            stroke="var(--viz-series-1)"
            strokeWidth={2}
            fill="var(--viz-series-1)"
            fillOpacity={0.18}
            isAnimationActive={!reducedMotion}
            animationDuration={700}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
      {projectionFrom !== undefined && (
        <figcaption className="mt-2 text-sm text-ink/60">
          Shaded years (FY{projectionFrom}+) are OMB estimates.
        </figcaption>
      )}
    </figure>
  );
}
