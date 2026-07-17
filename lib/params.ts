import { clampYear } from './format';

export type Unit = 'usd' | 'share';

export interface RangeState {
  from: number;
  to: number;
  unit: Unit;
}

export interface RawSearchParams {
  [key: string]: string | string[] | undefined;
}

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Year range + unit from URL query params (?from=1994&to=2025&unit=share),
 * clamped to the data's bounds so hand-edited URLs can't break queries.
 */
export function parseRange(
  params: RawSearchParams,
  bounds: { min: number; max: number },
  defaults: { from: number; to: number },
): RangeState {
  let from = clampYear(first(params.from), bounds.min, bounds.max, defaults.from);
  let to = clampYear(first(params.to), bounds.min, bounds.max, defaults.to);
  if (from > to) [from, to] = [to, from];
  const unit: Unit = first(params.unit) === 'share' ? 'share' : 'usd';
  return { from, to, unit };
}
