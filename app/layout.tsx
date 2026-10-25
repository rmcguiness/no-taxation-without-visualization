import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { BRAND, SITE_NAME, SITE_TAGLINE, siteUrl } from '@/lib/site';
import NavLinks from '@/components/NavLinks';
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND.paper },
    { media: '(prefers-color-scheme: dark)', color: '#101b20' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
          <nav
            aria-label="Main navigation"
            className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 px-5 py-3"
          >
            <Link
              href="/"
              aria-label="No Taxation without Visualization home"
              className="py-2 text-lg font-bold tracking-tight"
            >
              No Taxation <span className="text-accent">/</span>
              <span className="block text-xs font-normal tracking-wide text-muted">
                without Visualization
              </span>
            </Link>
            <NavLinks />
          </nav>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-6xl flex-1 px-5 py-12 sm:py-16"
        >
          {children}
        </main>
        <footer className="border-t border-ink/10">
          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-ink/70">
            <nav aria-label="Footer navigation" className="mb-6 flex flex-wrap gap-5 text-accent">
              <Link href="/">Home</Link>
              <Link href="/federal/revenue">Revenue</Link>
              <Link href="/federal/spending">Spending</Link>
              <Link href="/about">About</Link>
              <Link href="/methodology">Methodology</Link>
              <a href="https://github.com/rmcguiness/no-taxation-without-visualization">GitHub ↗</a>
            </nav>
            <p className="mb-4">
              Source: Office of Management and Budget ·{' '}
              <Link href="/methodology" className="text-accent underline">
                Historical Tables &amp; methods
              </Link>
            </p>
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
