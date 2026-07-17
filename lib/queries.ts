import 'server-only';
import { sql } from './db';

export interface SeriesPoint {
  fiscalYear: number;
  categoryCode: string;
  categoryName: string;
  amount: number;
  isProjection: boolean;
}

export interface SourceMeta {
  id: string;
  name: string;
  publisher: string;
  homepageUrl: string;
  confidence: string;
  asOf: string; // ISO date the snapshot was retrieved
}

export interface YearBounds {
  min: number;
  max: number;
  latestActual: number;
}

const RECEIPTS_SOURCE = 'omb_hist_2_1';
const OUTLAYS_SOURCE = 'omb_hist_3_2';

function toPoints(rows: Array<Record<string, unknown>>): SeriesPoint[] {
  return rows.map((r) => ({
    fiscalYear: Number(r.fiscal_year),
    categoryCode: String(r.category_code),
    categoryName: String(r.category_name),
    amount: Number(r.amount),
    isProjection: Boolean(r.is_projection),
  }));
}

/** Receipt components (5 sources) per year; excludes the TOTAL rollup. */
export async function getReceiptComponents(from: number, to: number): Promise<SeriesPoint[]> {
  const rows = await sql`
    SELECT fiscal_year, category_code, category_name, amount::float8 AS amount, is_projection
    FROM fiscal_series_latest
    WHERE data_source_id = ${RECEIPTS_SOURCE} AND metric = 'receipt'
      AND parent_category_code = 'TOTAL'
      AND fiscal_year BETWEEN ${from} AND ${to}
    ORDER BY fiscal_year, category_code`;
  return toPoints(rows);
}

/** Total receipts per year. */
export async function getReceiptTotals(from: number, to: number): Promise<SeriesPoint[]> {
  const rows = await sql`
    SELECT fiscal_year, category_code, category_name, amount::float8 AS amount, is_projection
    FROM fiscal_series_latest
    WHERE data_source_id = ${RECEIPTS_SOURCE} AND metric = 'receipt'
      AND category_code = 'TOTAL'
      AND fiscal_year BETWEEN ${from} AND ${to}
    ORDER BY fiscal_year`;
  return toPoints(rows);
}

/** Function-level outlays (20 budget functions) per year; excludes TOTAL. */
export async function getOutlayFunctions(from: number, to: number): Promise<SeriesPoint[]> {
  const rows = await sql`
    SELECT fiscal_year, category_code, category_name, amount::float8 AS amount, is_projection
    FROM fiscal_series_latest
    WHERE data_source_id = ${OUTLAYS_SOURCE} AND metric = 'outlay'
      AND parent_category_code IS NULL AND category_code <> 'TOTAL'
      AND fiscal_year BETWEEN ${from} AND ${to}
    ORDER BY fiscal_year, category_code`;
  return toPoints(rows);
}

/** One function's series (for sector pages). */
export async function getOutlayFunction(
  code: string,
  from: number,
  to: number,
): Promise<SeriesPoint[]> {
  const rows = await sql`
    SELECT fiscal_year, category_code, category_name, amount::float8 AS amount, is_projection
    FROM fiscal_series_latest
    WHERE data_source_id = ${OUTLAYS_SOURCE} AND metric = 'outlay'
      AND parent_category_code IS NULL AND category_code = ${code}
      AND fiscal_year BETWEEN ${from} AND ${to}
    ORDER BY fiscal_year`;
  return toPoints(rows);
}

/** Total outlays per year. */
export async function getOutlayTotals(from: number, to: number): Promise<SeriesPoint[]> {
  const rows = await sql`
    SELECT fiscal_year, category_code, category_name, amount::float8 AS amount, is_projection
    FROM fiscal_series_latest
    WHERE data_source_id = ${OUTLAYS_SOURCE} AND metric = 'outlay'
      AND category_code = 'TOTAL'
      AND fiscal_year BETWEEN ${from} AND ${to}
    ORDER BY fiscal_year`;
  return toPoints(rows);
}

/** Year coverage for a metric's source, and the latest non-projection year. */
export async function getYearBounds(metric: 'receipt' | 'outlay'): Promise<YearBounds> {
  const source = metric === 'receipt' ? RECEIPTS_SOURCE : OUTLAYS_SOURCE;
  const [row] = await sql`
    SELECT min(fiscal_year)::int AS min, max(fiscal_year)::int AS max,
           max(fiscal_year) FILTER (WHERE NOT is_projection)::int AS latest_actual
    FROM fiscal_series_latest
    WHERE data_source_id = ${source}`;
  if (!row || row.min === null) {
    throw new Error(`no ${metric} data loaded — run \`ntwv-ingest run\` (see ingest/README.md)`);
  }
  return { min: row.min, max: row.max, latestActual: row.latest_actual };
}

/** Source citation + as-of date for footers. */
export async function getSourceMeta(metric: 'receipt' | 'outlay'): Promise<SourceMeta> {
  const source = metric === 'receipt' ? RECEIPTS_SOURCE : OUTLAYS_SOURCE;
  const [row] = await sql`
    SELECT s.id, s.name, s.publisher, s.homepage_url, s.confidence,
           max(sn.retrieved_at)::date::text AS as_of
    FROM data_source s
    JOIN dataset_snapshot sn ON sn.data_source_id = s.id
    WHERE s.id = ${source}
    GROUP BY s.id`;
  if (!row) {
    throw new Error(`source ${source} not registered — run \`ntwv-ingest run\``);
  }
  return {
    id: row.id,
    name: row.name,
    publisher: row.publisher,
    homepageUrl: row.homepage_url,
    confidence: row.confidence,
    asOf: row.as_of,
  };
}
