import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronRight, User as UserIcon, Bell, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatDurationLabel } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  // Stats
  const [{ count: videosCount }, { data: history }, { count: favoritesCount }] = await Promise.all([
    supabase
      .from('watch_history')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase.from('watch_history').select('progress_seconds').eq('user_id', user.id),
    supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  const totalSeconds = (history ?? []).reduce(
    (sum, row: any) => sum + (row.progress_seconds ?? 0),
    0
  );

  const initial =
    profile?.full_name?.[0]?.toUpperCase() ?? profile?.username?.[0]?.toUpperCase() ?? 'U';

  return (
    <main className="px-6 pt-12 lg:px-12 lg:pt-10 lg:max-w-3xl lg:mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold">Mon Profil</h1>
        <p className="lg:hidden text-[11px] text-ink-tertiary italic">made by @itsloraee</p>
      </header>

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-3xl font-semibold border-4 border-brand-500/30">
          {initial}
        </div>
        <h2 className="mt-4 text-xl font-bold">{profile?.full_name ?? 'Utilisateur'}</h2>
        <p className="text-sm text-ink-tertiary">@{profile?.username ?? user.email?.split('@')[0]}</p>

        <Link
          href="/account"
          className="mt-4 px-6 py-2 rounded-full bg-gradient-brand text-sm font-semibold shadow-glow-sm hover:opacity-95 transition"
        >
          Modifier
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-8">
        <Stat value={(videosCount ?? 0).toString()} label="Vidéos" />
        <Stat
          value={totalSeconds > 0 ? formatDurationLabel(totalSeconds) : '0min'}
          label="Visionnage"
          highlight
        />
        <Stat value={(favoritesCount ?? 0).toString()} label="Favoris" />
        <Stat value="3" label="Listes" />
      </div>

      <ul className="mt-8 space-y-3">
        <MenuItem
          href="/account"
          icon={<UserIcon size={18} />}
          label="Mon compte"
          description="Gérer mes informations"
          tone="brand"
        />
        <MenuItem
          href="/notifications"
          icon={<Bell size={18} />}
          label="Notifications"
          description="Activer les alertes"
          tone="muted"
          highlighted
        />
        <MenuItem
          href="/settings"
          icon={<Settings size={18} />}
          label="Paramètres"
          description="Confidentialité & sécurité"
          tone="muted"
        />
      </ul>

      <form action="/auth/signout" method="post" className="mt-10">
        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-brand-900/40 border border-brand-500/40 text-brand-500 font-semibold flex items-center justify-center gap-2 hover:bg-brand-900/60 transition"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>
      </form>
    </main>
  );
}

function Stat({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl bg-surface-700/50 px-2 py-3 text-center">
      <p className={`text-xl font-bold ${highlight ? 'text-brand-500' : 'text-ink-primary'}`}>
        {value}
      </p>
      <p className="text-[10px] text-ink-tertiary mt-0.5">{label}</p>
    </div>
  );
}

function MenuItem({
  href,
  icon,
  label,
  description,
  tone,
  highlighted,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  tone: 'brand' | 'muted';
  highlighted?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition ${
          highlighted
            ? 'bg-surface-700 ring-1 ring-surface-500/40'
            : 'bg-surface-700/40 hover:bg-surface-700/70'
        }`}
      >
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            tone === 'brand' ? 'bg-brand-900/60 text-brand-500' : 'bg-surface-500/40 text-ink-secondary'
          }`}
        >
          {icon}
        </span>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-ink-tertiary mt-0.5">{description}</p>
        </div>
        <ChevronRight size={18} className="text-ink-tertiary" />
      </Link>
    </li>
  );
}
