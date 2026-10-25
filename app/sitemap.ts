import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';
import { SECTORS } from '@/lib/sectors';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    '/',
    '/about',
    '/methodology',
    '/federal/revenue',
    '/federal/spending',
    ...SECTORS.map((s) => `/sectors/${s.slug}`),
  ].map((path) => ({ url: new URL(path, siteUrl()).href }));
}
