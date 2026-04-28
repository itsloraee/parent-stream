'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, User, Library, LogOut } from 'lucide-react';
import Logo from '@/components/Logo';

const items = [
  { href: '/home', icon: Home, label: 'Accueil' },
  { href: '/search', icon: Search, label: 'Rechercher' },
  { href: '/catalog', icon: Library, label: 'Catalogue' },
  { href: '/my-list', icon: Bookmark, label: 'Ma Liste' },
  { href: '/profile', icon: User, label: 'Profil' },
];

/**
 * Sidebar verticale visible uniquement à partir du breakpoint lg (1024px).
 * Sur mobile/tablette c'est BottomNav qui prend le relais.
 */
export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 bottom-0 w-64 flex-col border-r border-surface-500/20 bg-surface-900/60 backdrop-blur-md z-40 px-6 py-8">
      <Link href="/home" aria-label="Accueil" className="flex items-center gap-3 mb-12">
        <div className="scale-75 origin-left">
          <Logo />
        </div>
      </Link>

      <nav className="flex-1">
        <ul className="space-y-1">
          {items.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-label={label}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? 'bg-brand-900/40 text-brand-500 nav-active-glow'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-700/50'
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                  <span className="text-sm font-semibold">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-ink-tertiary hover:text-ink-primary hover:bg-surface-700/50 transition"
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold">Se déconnecter</span>
        </button>
      </form>

      <p className="mt-4 text-center text-[10px] text-ink-tertiary italic">
        made by @itsloraee
      </p>
    </aside>
  );
}
