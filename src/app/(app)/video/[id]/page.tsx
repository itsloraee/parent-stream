import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import VideoDetailClient from './VideoDetailClient';

export const dynamic = 'force-dynamic';

export default async function VideoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Vidéo principale
  const { data: video } = await supabase
    .from('videos')
    .select(
      `id, title, subtitle, description, duration_seconds, video_url, thumbnail_url,
       rating, satisfaction, views_count, episode_number, series_id,
       category:categories(slug, name)`
    )
    .eq('id', id)
    .maybeSingle();

  if (!video) notFound();

  // Épisodes de la même série
  let episodes: any[] = [];
  let seriesTitle: string | null = null;
  if (video.series_id) {
    const { data: ep } = await supabase
      .from('videos')
      .select('id, title, subtitle, episode_number, duration_seconds')
      .eq('series_id', video.series_id)
      .order('episode_number', { ascending: true });
    episodes = ep ?? [];

    const { data: series } = await supabase
      .from('series')
      .select('title')
      .eq('id', video.series_id)
      .maybeSingle();
    seriesTitle = series?.title ?? null;
  }

  // Vidéos similaires (même catégorie, hors la vidéo actuelle)
  const { data: similar } = await supabase
    .from('videos')
    .select('id, title, subtitle, duration_seconds, thumbnail_url')
    .eq('is_published', true)
    .neq('id', video.id)
    .limit(8);

  // Statut favori / like
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: fav }, { data: like }] = await Promise.all([
    supabase
      .from('favorites')
      .select('user_id')
      .eq('user_id', user!.id)
      .eq('video_id', video.id)
      .maybeSingle(),
    supabase
      .from('likes')
      .select('user_id')
      .eq('user_id', user!.id)
      .eq('video_id', video.id)
      .maybeSingle(),
  ]);

  return (
    <VideoDetailClient
      video={video as any}
      seriesTitle={seriesTitle}
      episodes={episodes}
      similar={similar ?? []}
      isFavorite={!!fav}
      isLiked={!!like}
    />
  );
}
