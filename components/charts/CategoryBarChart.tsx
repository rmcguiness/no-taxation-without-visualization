'use client';

import { useEffect, useRef, useState } from 'react';
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
import { tooltipStyle } from './chartTheme';

export interface BarDatum {
  label: string;
  value: number;
}

interface Props {
  data: BarDatum[]; // sorted by the caller; magnitude job → single hue
  ariaLabel: string;
  labelWidth?: number;
}

/** Wrap a label into at most `maxLines` lines given a per-line character budget,
 *  ellipsizing the final line if it still overflows. Keeps long sector names
 *  readable on narrow screens instead of truncating to a single clipped line. */
function wrapLabel(label: string, charsPerLine: number, maxLines: number): string[] {
  if (label.length <= charsPerLine) return [label];
  const words = label.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > charsPerLine && current) {
      lines.push(current);
      current = word;
      if (lines.length === maxLines - 1) break;
    } else {
      current = candidate;
    }
  }
  const used = lines.join(' ').length;
  let tail = label.slice(used).trim();
  if (tail.length > charsPerLine) tail = `${tail.slice(0, charsPerLine - 1).trimEnd()}…`;
  lines.push(tail);
  return lines.slice(0, maxLines);
}

/** Track the rendered width of a container element via ResizeObserver. */
function useContainerWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);
  return { ref, width };
}

export default function CategoryBarChart({ data, ariaLabel, labelWidth = 210 }: Props) {
  const { ref, width } = useContainerWidth<HTMLDivElement>();

  // On narrow screens give the label column less room so the bars stay legible;
  // wrap onto two lines and use taller rows to fit the wrapped text.
  const narrow = width > 0 && width < 520;
  const resolvedLabelWidth = narrow
    ? Math.max(96, Math.min(150, Math.round(width * 0.46)))
    : labelWidth;
  const fontSize = narrow ? 11 : 12;
  const rightMargin = narrow ? 46 : 64;
  const maxLines = narrow ? 2 : 1;
  const charsPerLine = Math.max(8, Math.floor(resolvedLabelWidth / (fontSize * 0.58)));
  const rowHeight = narrow ? 46 : 32;
  const height = data.length * rowHeight + 24;

  // Place the value just past the bar's right edge. For negative bars that edge
  // is the zero baseline, so the label sits in the open plot area to the right
  // instead of colliding with the (right-aligned) category labels on the left.
  const renderValueLabel = (props: {
    x?: string | number;
    y?: string | number;
    width?: string | number;
    height?: string | number;
    value?: unknown;
  }) => {
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const width = Number(props.width ?? 0);
    const height = Number(props.height ?? 0);
    return (
      <text
        x={x + width + 6}
        y={y + height / 2}
        textAnchor="start"
        dominantBaseline="central"
        fill="var(--viz-ink-secondary)"
        fontSize={fontSize}
      >
        {formatUsd(Number(props.value))}
      </text>
    );
  };

  const renderTick = (props: {
    x?: string | number;
    y?: string | number;
    payload?: { value?: string | number };
  }) => {
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const lines = wrapLabel(String(props.payload?.value ?? ''), charsPerLine, maxLines);
    const lineHeight = fontSize + 2;
    const startDy = -((lines.length - 1) * lineHeight) / 2;
    return (
      <text x={x} y={y} textAnchor="end" fill="var(--viz-ink-secondary)" fontSize={fontSize}>
        {lines.map((line, i) => (
          <tspan key={i} x={x} dy={i === 0 ? startDy : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>
    );
  };

  return (
    <figure ref={ref} aria-label={ariaLabel} role="img">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: rightMargin, bottom: 0, left: 0 }}
          barCategoryGap={6}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={resolvedLabelWidth}
            tick={renderTick}
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
            <LabelList dataKey="value" content={renderValueLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </figure>
  );
}
