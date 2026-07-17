'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatUsd } from '@/lib/format';
import { axisTick, tooltipStyle, type ChartUnit, type SeriesDef, type YearRow } from './chartTheme';

interface Props {
  rows: YearRow[];
  series: SeriesDef[]; // stack order, bottom first; colors follow the entity
  unit: ChartUnit;
  ariaLabel: string;
  height?: number;
}

function tickValue(unit: ChartUnit) {
  return (v: number) => (unit === 'usd' ? formatUsd(v) : `${Math.round(v)}%`);
}

function tooltipValue(unit: ChartUnit) {
  return (v: number | string) =>
    unit === 'usd' ? formatUsd(Number(v)) : `${Number(v).toFixed(1)}%`;
}

export default function StackedAreaChart({ rows, series, unit, ariaLabel, height = 340 }: Props) {
  const data = rows.map((r) => ({ year: r.year, ...r.values }));
  const projectionFrom = rows.find((r) => r.isProjection)?.year;
  const lastYear = rows.at(-1)?.year;

  return (
    <figure aria-label={ariaLabel} role="img">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid stroke="var(--viz-grid)" vertical={false} />
          <XAxis
            dataKey="year"
            tick={axisTick}
            tickLine={false}
            axisLine={{ stroke: 'var(--viz-baseline)' }}
            minTickGap={36}
          />
          <YAxis
            tickFormatter={tickValue(unit)}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={56}
            domain={unit === 'share' ? [0, 100] : [0, 'auto']}
            ticks={unit === 'share' ? [0, 25, 50, 75, 100] : undefined}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [tooltipValue(unit)(value as number), name as string]}
            labelFormatter={(year) => `FY${year}`}
            itemSorter={() => -1}
          />
          {projectionFrom !== undefined && lastYear !== undefined && (
            <ReferenceArea
              x1={projectionFrom}
              x2={lastYear}
              fill="var(--viz-projection-wash)"
              stroke="none"
            />
          )}
          {series.map((s) => (
            <Area
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId="stack"
              stroke="var(--viz-surface)"
              strokeWidth={1}
              fill={s.color}
              fillOpacity={1}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <figcaption className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink/80">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
          </span>
        ))}
        {projectionFrom !== undefined && (
          <span className="text-ink/60">Shaded years (FY{projectionFrom}+) are OMB estimates.</span>
        )}
      </figcaption>
    </figure>
  );
}
