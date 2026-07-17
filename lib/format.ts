/** Money and fiscal-year formatting. Amounts are nominal USD. */

const TIER: Array<{ floor: number; suffix: string }> = [
  { floor: 1e12, suffix: 'T' },
  { floor: 1e9, suffix: 'B' },
  { floor: 1e6, suffix: 'M' },
  { floor: 1e3, suffix: 'K' },
];

/** Compact money: $7.01T, $916B, -$318B, $53.4B, $420M, $0. */
export function formatUsd(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  for (const { floor, suffix } of TIER) {
    if (abs >= floor) {
      const value = abs / floor;
      const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
      return `${sign}$${value.toFixed(digits)}${suffix}`;
    }
  }
  return `${sign}$${Math.round(abs)}`;
}

/** Full-precision money for tables: $5,236,421,000,000. */
export function formatUsdExact(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Share of total: 0.2264 → '22.6%'. */
export function formatShare(fraction: number): string {
  const pct = fraction * 100;
  const digits = Math.abs(pct) >= 10 ? 1 : Math.abs(pct) >= 1 ? 1 : 2;
  return `${pct.toFixed(digits)}%`;
}

/** Federal fiscal year label. The federal FY ends September 30. */
export function fyLabel(year: number): string {
  return `FY${year}`;
}

/** Clamp an integer year into [min, max]; fall back when unparsable. */
export function clampYear(
  raw: string | undefined,
  min: number,
  max: number,
  fallback: number,
): number {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}
