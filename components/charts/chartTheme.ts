/** Shared chart styling: everything references the viz CSS vars. */

export const SERIES_VARS = [
  'var(--viz-series-1)',
  'var(--viz-series-2)',
  'var(--viz-series-3)',
  'var(--viz-series-4)',
  'var(--viz-series-5)',
  'var(--viz-series-6)',
  'var(--viz-series-7)',
  'var(--viz-series-8)',
] as const;

export const OTHER_VAR = 'var(--viz-other)';

export const axisTick = { fill: 'var(--viz-muted)', fontSize: 12 } as const;

export type ChartUnit = 'usd' | 'share';

export interface SeriesDef {
  key: string;
  label: string;
  color: string;
}

export interface YearRow {
  year: number;
  isProjection: boolean;
  values: Record<string, number>;
}
