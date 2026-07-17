import { describe, expect, it } from 'vitest';
import { SECTORS, sectorByCode, sectorBySlug } from './sectors';

// The 20 OMB budget functions present in Historical Table 3.2.
const OMB_FUNCTION_CODES = [
  '050',
  '150',
  '250',
  '270',
  '300',
  '350',
  '370',
  '400',
  '450',
  '500',
  '550',
  '570',
  '600',
  '650',
  '700',
  '750',
  '800',
  '900',
  '920',
  '950',
];

describe('sector mapping', () => {
  it('covers every OMB budget function exactly once', () => {
    expect(SECTORS.map((s) => s.functionCode).sort()).toEqual(OMB_FUNCTION_CODES);
  });

  it('has unique slugs', () => {
    expect(new Set(SECTORS.map((s) => s.slug)).size).toBe(SECTORS.length);
  });

  it('every sector has complete plain-English copy', () => {
    for (const s of SECTORS) {
      expect(s.name.length, s.slug).toBeGreaterThan(3);
      expect(s.description.length, s.slug).toBeGreaterThan(20);
      expect(s.includes.length, s.slug).toBeGreaterThan(20);
      expect(s.excludes.length, s.slug).toBeGreaterThan(10);
    }
  });

  it('uses claims-policy-safe language (no fraud/theft/corruption labels)', () => {
    const forbidden = /fraud|theft|steal|corrupt|pocket/i;
    for (const s of SECTORS) {
      expect(`${s.description} ${s.includes} ${s.excludes}`).not.toMatch(forbidden);
    }
  });

  it('lookup maps are consistent', () => {
    expect(sectorBySlug.get('education')?.functionCode).toBe('500');
    expect(sectorByCode.get('650')?.slug).toBe('social-security');
  });
});
