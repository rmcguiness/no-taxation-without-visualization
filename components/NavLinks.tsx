'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
export const navLinks = [
  ['/', 'Home'],
  ['/federal/revenue', 'Revenue'],
  ['/federal/spending', 'Spending'],
  ['/about', 'About'],
  ['/methodology', 'Methodology'],
];
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex gap-1 overflow-x-auto py-2 text-sm">
      {navLinks.map(([href, label]) => (
        <li key={href} className="shrink-0">
          <Link
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
            className={`block rounded-md px-3 py-2 font-medium hover:bg-accent/10 ${pathname === href ? 'bg-accent/10 text-accent' : 'text-muted'}`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
