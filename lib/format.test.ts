import { describe, expect, it } from 'vitest';
import { clampYear, formatShare, formatUsd, fyLabel } from './format';

describe('formatUsd', () => {
  it('formats trillions, billions, millions with sensible precision', () => {
    expect(formatUsd(7_011_105_000_000)).toBe('$7.01T');
    expect(formatUsd(916_140_000_000)).toBe('$916B');
    expect(formatUsd(53_400_000_000)).toBe('$53.4B');
    expect(formatUsd(420_000_000)).toBe('$420M');
    expect(formatUsd(1_500)).toBe('$1.50K');
  });

  it('handles negatives (offsetting receipts) and zero', () => {
    expect(formatUsd(-318_000_000_000)).toBe('-$318B');
    expect(formatUsd(0)).toBe('$0');
  });
});

describe('formatShare', () => {
  it('formats fractions as percentages', () => {
    expect(formatShare(0.2264)).toBe('22.6%');
    expect(formatShare(0.051)).toBe('5.1%');
    expect(formatShare(0.0042)).toBe('0.42%');
  });
});

describe('fyLabel', () => {
  it('labels federal fiscal years', () => {
    expect(fyLabel(2025)).toBe('FY2025');
  });
});

describe('clampYear', () => {
  it('clamps into bounds and falls back on garbage', () => {
    expect(clampYear('1990', 1962, 2031, 2000)).toBe(1990);
    expect(clampYear('1800', 1962, 2031, 2000)).toBe(1962);
    expect(clampYear('9999', 1962, 2031, 2000)).toBe(2031);
    expect(clampYear('potato', 1962, 2031, 2000)).toBe(2000);
    expect(clampYear(undefined, 1962, 2031, 2000)).toBe(2000);
  });
});
