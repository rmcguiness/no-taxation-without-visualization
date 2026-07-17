import type { SeriesPoint } from './queries';
import type { SeriesDef, YearRow } from '@/components/charts/chartTheme';
import { SERIES_VARS, OTHER_VAR } from '@/components/charts/chartTheme';
import { sectorByCode } from './sectors';

/**
 * Fixed identity → color assignment for receipt sources (never re-ordered:
 * color follows the entity). Stack order is bottom-first, largest first.
 */
export const RECEIPT_SERIES: SeriesDef[] = [
  { key: 'individual_income_taxes', label: 'Individual income taxes', color: SERIES_VARS[0] },
  {
    key: 'social_insurance_retirement',
    label: 'Payroll (social insurance)',
    color: SERIES_VARS[1],
  },
  { key: 'corporation_income_taxes', label: 'Corporate income taxes', color: SERIES_VARS[2] },
  { key: 'other', label: 'Other receipts', color: SERIES_VARS[3] },
  { key: 'excise_taxes', label: 'Excise taxes', color: SERIES_VARS[4] },
];

const OTHER_KEY = '__other__';

/** Pivot long-format points into one row per year, keyed by category code. */
export function pivotByYear(points: SeriesPoint[]): YearRow[] {
  const byYear = new Map<number, YearRow>();
  for (const p of points) {
    let row = byYear.get(p.fiscalYear);
    if (!row) {
      row = { year: p.fiscalYear, isProjection: p.isProjection, values: {} };
      byYear.set(p.fiscalYear, row);
    }
    row.values[p.categoryCode] = p.amount;
  }
  return [...byYear.values()].sort((a, b) => a.year - b.year);
}

/** Convert each row's values to percent-of-that-year's-total (0–100). */
export function toShareOfTotal(rows: YearRow[], totalsByYear: Map<number, number>): YearRow[] {
  return rows.map((r) => {
    const total = totalsByYear.get(r.year);
    const values: Record<string, number> = {};
    for (const [k, v] of Object.entries(r.values)) {
      values[k] = total ? (v / total) * 100 : 0;
    }
    return { ...r, values };
  });
}

export function totalsMap(totals: SeriesPoint[]): Map<number, number> {
  return new Map(totals.map((t) => [t.fiscalYear, t.amount]));
}

/**
 * Series defs for the spending stacked area: top N functions by size in the
 * reference year get categorical slots (fixed to the entity for this view);
 * the rest fold into 'Everything else' per the series-count ceiling.
 */
export function spendingSeries(
  functionRows: YearRow[],
  referenceYear: number,
  topN = 7,
): { series: SeriesDef[]; rows: YearRow[] } {
  const reference = functionRows.find((r) => r.year === referenceYear) ?? functionRows.at(-1);
  if (!reference) return { series: [], rows: [] };

  const ranked = Object.entries(reference.values)
    .sort(([, a], [, b]) => b - a)
    .map(([code]) => code);
  const top = ranked.slice(0, topN);

  const series: SeriesDef[] = top.map((code, i) => ({
    key: code,
    label: sectorByCode.get(code)?.name ?? code,
    color: SERIES_VARS[i],
  }));
  series.push({ key: OTHER_KEY, label: 'Everything else', color: OTHER_VAR });

  const rows: YearRow[] = functionRows.map((r) => {
    const values: Record<string, number> = {};
    let other = 0;
    for (const [code, amount] of Object.entries(r.values)) {
      if (top.includes(code)) values[code] = amount;
      else other += amount;
    }
    values[OTHER_KEY] = other;
    return { ...r, values };
  });

  return { series, rows };
}
