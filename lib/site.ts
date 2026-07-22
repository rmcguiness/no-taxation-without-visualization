/** Canonical site metadata, shared by <head> tags and generated OG/icon images. */

export const SITE_NAME = 'No Taxation without Visualization';

export const SITE_TAGLINE =
  'See where U.S. public money comes from, where it goes, and which government decides — with sources for every number.';

/** Brand colors, kept in sync with the accent token in globals.css. */
export const BRAND = {
  accent: '#0f766e',
  accentDark: '#115e59',
  paper: '#fafaf7',
  ink: '#1c2733',
} as const;

/**
 * Absolute base URL for canonical/OG links. Prefers an explicit site URL, then
 * the Vercel-provided production/deployment host, then localhost for dev.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  const raw = explicit ?? (vercel ? `https://${vercel}` : 'http://localhost:3000');
  return new URL(raw);
}
