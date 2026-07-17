import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'No Taxation without Visualization',
    template: '%s · No Taxation without Visualization',
  },
  description:
    'See where U.S. public money comes from, where it goes, and which government decides — with sources for every number.',
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
