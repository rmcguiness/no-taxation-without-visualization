'use client';

import {
  Bar,
  BarChart,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatUsd } from '@/lib/format';
import { axisTick, tooltipStyle } from './chartTheme';

export interface BarDatum {
  label: string;
  value: number;
}

interface Props {
  data: BarDatum[]; // sorted by the caller; magnitude job → single hue
  ariaLabel: string;
  labelWidth?: number;
}

export default function CategoryBarChart({ data, ariaLabel, labelWidth = 210 }: Props) {
  const height = data.length * 32 + 24;
  return (
    <figure aria-label={ariaLabel} role="img">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 64, bottom: 0, left: 0 }}
          barCategoryGap={6}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={labelWidth}
            tick={{ ...axisTick, fill: 'var(--viz-ink-secondary)' }}
            tickLine={false}
            axisLine={false}
            interval={0}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [formatUsd(Number(value)), 'Outlays']}
            cursor={{ fill: 'var(--viz-projection-wash)' }}
          />
          <ReferenceLine x={0} stroke="var(--viz-baseline)" />
          <Bar
            dataKey="value"
            fill="var(--viz-series-1)"
            radius={[0, 4, 4, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) => formatUsd(Number(v))}
              style={{ fill: 'var(--viz-ink-secondary)', fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}
