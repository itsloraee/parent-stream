import Link from 'next/link';
import { Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import HomeContent from './HomeContent';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  // Profil utilisateur (pour avatar)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user!.id)
    .maybeSingle();

  // Catégories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  // Hero (premier item d'une série is_new)
  const { data: heroSeries } = await supabase
    .from('series')
    .select('id, title, rating, is_new')
    .eq('is_new', true)
    .limit(1)
    .maybeSingle();

  // Continuer à regarder
  const { data: continueWatching } = await supabase
    .from('watch_history')
    .select(
      'progress_seconds, video:videos(id, title, subtitle, duration_seconds, thumbnail_url)'
    )
    .eq('user_id', user!.id)
    .order('last_watched_at', { ascending: false })
    .limit(6);

  // Recommandé pour vous
  // Tri en 3 niveaux pour garder un ordre cohérent :
  //  1. series_id NULLS FIRST → vidéos standalone d'abord, puis épisodes groupés
  //  2. episode_number ASC → épisodes dans l'ordre 1, 2, 3 au sein d'une série
  //  3. views_count DESC → standalones triés par popularité
  const { data: recommended } = await supabase
    .from('videos')
    .select('id, title, subtitle, duration_seconds, thumbnail_url')
    .eq('is_published', true)
    .order('series_id', { ascending: true, nullsFirst: true })
    .order('episode_number', { ascending: true, nullsFirst: false })
    .order('views_count', { ascending: false })
    .limit(8);

  const initial =
    profile?.full_name?.[0]?.toUpperCase() ?? profile?.username?.[0]?.toUpperCase() ?? 'U';

  return (
    <main className="px-6 pt-12 lg:px-12 lg:pt-10 lg:max-w-7xl lg:mx-auto">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl lg:text-3xl font-semibold">Parent Stream</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500" />
          </Link>
          <Link
            href="/profile"
            aria-label="Profil"
            className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-sm font-semibold"
          >
            {initial}
          </Link>
        </div>
      </header>

      <p className="lg:hidden text-[10px] text-ink-tertiary italic absolute right-6 top-3">
        made by @itsloraee
      </p>

      <HomeContent
        categories={categories ?? []}
        heroSeries={heroSeries}
        continueWatching={(continueWatching ?? []).map((row: any) => ({
          ...row.video,
          progress_percent:
            row.video?.duration_seconds > 0
              ? Math.round((row.progress_seconds / row.video.duration_seconds) * 100)
              : 0,
        }))}
        recommended={recommended ?? []}
      />
    </main>
  );
}
