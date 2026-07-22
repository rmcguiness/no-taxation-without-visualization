import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { BRAND, SITE_NAME, SITE_TAGLINE, siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  keywords: [
    'federal budget',
    'government spending',
    'taxes',
    'public finance',
    'data visualization',
    'U.S. revenue',
    'OMB',
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_TAGLINE,
    url: '/',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_TAGLINE,
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.paper,
  colorScheme: 'light',
};

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/federal/revenue', label: 'Revenue' },
  { href: '/federal/spending', label: 'Spending' },
  { href: '/about', label: 'About' },
  { href: '/methodology', label: 'Methodology' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <header className="border-b border-ink/10">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4"
          >
            <Link href="/" className="font-semibold tracking-tight hover:text-accent">
              NTwV
            </Link>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-accent hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">{children}</main>
        <footer className="border-t border-ink/10">
          <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-ink/70">
            <p>
              Public data for civic understanding. Balanced books do not prove absence of fraud.
              Gaps may mean missing data, not theft.
            </p>
            <p className="mt-2">Not affiliated with any government agency.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
