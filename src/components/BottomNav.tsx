'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, User } from 'lucide-react';

const items = [
  { href: '/home', icon: Home, label: 'Accueil' },
  { href: '/search', icon: Search, label: 'Rechercher' },
  { href: '/my-list', icon: Bookmark, label: 'Ma Liste' },
  { href: '/profile', icon: User, label: 'Profil' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-40 border-t border-surface-500/20 bg-surface-900/85 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <ul className="flex items-center justify-around px-4 py-3">
        {items.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                className={`flex items-center justify-center w-12 h-12 rounded-full transition ${
                  isActive ? 'text-brand-500 nav-active-glow' : 'text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? 'currentColor' : 'none'} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
