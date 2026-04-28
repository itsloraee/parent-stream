import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import VideoCard from '@/components/VideoCard';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const supabase = await createClient();

  // Toutes les vidéos publiées
  // Tri en 3 niveaux pour garder un ordre cohérent :
  //  1. series_id NULLS FIRST → vidéos standalone d'abord, puis épisodes groupés
  //  2. episode_number ASC → épisodes dans l'ordre 1, 2, 3 au sein d'une série
  //  3. views_count DESC → standalones triés par popularité
  const { data: videos } = await supabase
    .from('videos')
    .select('id, title, subtitle, duration_seconds, thumbnail_url, views_count')
    .eq('is_published', true)
    .order('series_id', { ascending: true, nullsFirst: true })
    .order('episode_number', { ascending: true, nullsFirst: false })
    .order('views_count', { ascending: false });

  return (
    <main className="px-6 pt-12 pb-12">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            aria-label="Retour"
            className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center"
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-2xl font-semibold">Catalogue</h1>
        </div>
        <p className="lg:hidden text-[11px] text-ink-tertiary italic">made by @itsloraee</p>
      </header>

      <p className="text-sm text-ink-tertiary mb-6">
        {(videos ?? []).length} vidéo{(videos ?? []).length > 1 ? 's' : ''} disponibles
      </p>

      {videos && videos.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {videos.map((v: any, i: number) => (
            <VideoCard
              key={v.id}
              video={v}
              thumbVariant={((i % 4) + 1) as 1 | 2 | 3 | 4}
            />
          ))}
        </div>
      ) : (
        <p className="mt-12 text-center text-sm text-ink-tertiary">
          Aucune vidéo disponible pour le moment.
        </p>
      )}
    </main>
  );
}
