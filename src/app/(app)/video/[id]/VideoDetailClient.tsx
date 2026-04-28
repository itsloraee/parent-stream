'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Bookmark, Share2, Download, MoreHorizontal, Pause, Play } from 'lucide-react';
import VideoCard, { type VideoCardData } from '@/components/VideoCard';
import { formatDuration, formatDurationLabel, formatCount } from '@/lib/format';
import { createClient } from '@/lib/supabase/client';
import { getYouTubeId, buildYouTubeEmbedUrl } from '@/lib/youtube';

interface Video {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  duration_seconds: number;
  video_url: string | null;
  thumbnail_url: string | null;
  rating: number;
  satisfaction: number;
  views_count: number;
  episode_number: number | null;
  series_id: string | null;
  category: { slug: string; name: string } | null;
}

interface Episode {
  id: string;
  title: string;
  subtitle: string | null;
  episode_number: number | null;
  duration_seconds: number;
}

interface Props {
  video: Video;
  seriesTitle: string | null;
  episodes: Episode[];
  similar: VideoCardData[];
  isFavorite: boolean;
  isLiked: boolean;
}

export default function VideoDetailClient({
  video,
  seriesTitle,
  episodes,
  similar,
  isFavorite: initialFavorite,
  isLiked: initialLiked,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [view, setView] = useState<'player' | 'details'>('details');

  // Détection d'une vidéo YouTube : on utilise un iframe au lieu du <video> natif
  const youtubeId = getYouTubeId(video.video_url);
  const isYouTube = !!youtubeId;

  const togglePlay = () => {
    if (!videoRef.current) {
      // Pas de vidéo source, on simule
      setIsPlaying((p) => !p);
      return;
    }
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleLike = async () => {
    setIsLiked((p) => !p);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (!isLiked) {
      await supabase.from('likes').insert({ user_id: user.id, video_id: video.id });
    } else {
      await supabase.from('likes').delete().match({ user_id: user.id, video_id: video.id });
    }
  };

  const toggleFavorite = async () => {
    setIsFavorite((p) => !p);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (!isFavorite) {
      await supabase.from('favorites').insert({ user_id: user.id, video_id: video.id });
    } else {
      await supabase.from('favorites').delete().match({ user_id: user.id, video_id: video.id });
    }
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({
        title: video.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Vue 1 : Player vidéo (mockup #5)
  // Affiché dès qu'une source vidéo est dispo, même sans série
  if (view === 'player' && video.video_url) {
    return (
      <main className="min-h-dvh -mt-0 page-fade lg:max-w-7xl lg:mx-auto lg:px-12 lg:pt-8">
        {/* Player
         * Mobile : pleine largeur, hauteur 55vh
         * Desktop : ratio 16/9 dans le conteneur, max-w-5xl pour rester cadré
         */}
        <div className="relative h-[55vh] lg:h-auto lg:aspect-video lg:max-w-5xl lg:mx-auto lg:rounded-2xl video-thumb overflow-hidden bg-black">
          {/* Source vidéo : iframe YouTube OU <video> HTML natif */}
          {isYouTube && youtubeId ? (
            <iframe
              src={buildYouTubeEmbedUrl(youtubeId, { autoplay: true })}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          ) : video.video_url ? (
            <video
              ref={videoRef}
              src={video.video_url}
              className="absolute inset-0 w-full h-full object-cover"
              onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
            />
          ) : null}

          {/* Header overlay (titre + bouton retour) */}
          <header
            className={`absolute top-0 left-0 right-0 flex items-start justify-between p-5 z-10 ${
              isYouTube ? 'pointer-events-none' : ''
            } bg-gradient-to-b from-black/70 to-transparent`}
          >
            <div className={isYouTube ? 'pointer-events-auto' : ''}>
              <h1 className="text-lg font-bold">{seriesTitle ?? video.title}</h1>
              {video.episode_number && (
                <span className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-gradient-brand text-[11px] font-semibold tracking-wider">
                  Épisode {video.episode_number}
                </span>
              )}
            </div>
            <button
              onClick={() => setView('details')}
              className={`text-white/90 ${isYouTube ? 'pointer-events-auto' : ''}`}
              aria-label="Retour aux détails"
            >
              <MoreHorizontal size={22} />
            </button>
          </header>

          {/* Contrôles natifs : uniquement pour le lecteur HTML5 (YouTube a les siens) */}
          {!isYouTube && (
            <div className="absolute inset-0 flex flex-col pointer-events-none z-10">
              <div className="h-20" />
              <button
                onClick={togglePlay}
                className="m-auto w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center pointer-events-auto"
                aria-label={isPlaying ? 'Pause' : 'Lecture'}
              >
                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1.5" />}
              </button>

              <div className="px-6 pb-5 pointer-events-auto">
                <div className="flex items-center justify-between text-xs font-medium mb-2">
                  <span>{formatDuration(progress)}</span>
                  <span className="text-ink-secondary">{formatDuration(video.duration_seconds)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={video.duration_seconds}
                  value={progress}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setProgress(v);
                    if (videoRef.current) videoRef.current.currentTime = v;
                  }}
                  className="range-progress w-full"
                  style={{
                    background: `linear-gradient(to right, #DC2626 0%, #DC2626 ${
                      (progress / video.duration_seconds) * 100
                    }%, rgba(255,255,255,0.2) ${
                      (progress / video.duration_seconds) * 100
                    }%, rgba(255,255,255,0.2) 100%)`,
                    borderRadius: 9999,
                    height: 4,
                    WebkitAppearance: 'none',
                    appearance: 'none',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Info & actions */}
        <section className="px-6 pt-6 pb-8 lg:max-w-5xl lg:mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold">{seriesTitle ?? video.title}</h2>
          {seriesTitle && video.episode_number ? (
            <p className="text-sm text-ink-secondary mt-1">
              S01E0{video.episode_number} — {video.subtitle}
            </p>
          ) : video.subtitle ? (
            <p className="text-sm text-ink-secondary mt-1">{video.subtitle}</p>
          ) : null}

          <div className="grid grid-cols-4 gap-2 mt-6">
            <ActionButton
              icon={<Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />}
              label="J'aime"
              onClick={toggleLike}
              active={isLiked}
            />
            <ActionButton
              icon={<Bookmark size={20} fill={isFavorite ? 'currentColor' : 'none'} />}
              label="Enregistrer"
              onClick={toggleFavorite}
              active={isFavorite}
            />
            <ActionButton icon={<Share2 size={20} />} label="Partager" onClick={share} />
            <ActionButton icon={<Download size={20} />} label="Télécharger" onClick={() => {}} />
          </div>

          {episodes.length > 0 && (
            <>
              <h3 className="text-base font-semibold mt-8 mb-3">Épisodes de la série</h3>
              <ul className="space-y-2.5">
                {episodes.map((ep) => {
              const isCurrent = ep.id === video.id;
              return (
                <li key={ep.id}>
                  <button
                    onClick={() => router.push(`/video/${ep.id}`)}
                    className={`w-full text-left rounded-xl px-4 py-3 flex items-center justify-between transition ${
                      isCurrent
                        ? 'border-l-2 border-brand-500 bg-surface-700'
                        : 'bg-surface-700/50 hover:bg-surface-700'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">Épisode {ep.episode_number}</p>
                      <p className="text-xs text-ink-tertiary mt-0.5">
                        {ep.subtitle} · {formatDurationLabel(ep.duration_seconds)}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="text-[11px] font-bold text-brand-500 tracking-wider">
                        EN COURS
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
              </ul>
            </>
          )}
        </section>
      </main>
    );
  }

  // Vue 2 : Détails vidéo (mockup #6)
  return (
    <main className="page-fade lg:max-w-7xl lg:mx-auto lg:px-12 lg:pt-8">
      {/* Hero (placeholder thumbnail) */}
      <div className="relative h-72 lg:h-[500px] lg:rounded-2xl video-thumb-2 lg:overflow-hidden">
        <button
          onClick={() => setView('player')}
          className="absolute inset-0 flex items-center justify-center group"
          aria-label="Lire la vidéo"
        >
          <span className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:bg-white/30 transition">
            <Play size={32} fill="white" className="ml-1.5" />
          </span>
        </button>
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-[11px] tracking-wider">
          {formatDuration(video.duration_seconds)}
        </span>
      </div>

      <section className="px-6 pt-6 pb-10 lg:px-0">
        {video.category && (
          <span className="inline-block px-3 py-1 rounded-full bg-gradient-brand text-[11px] font-semibold tracking-wider">
            {video.category.name.toUpperCase()}
          </span>
        )}

        <h1 className="text-3xl lg:text-4xl font-bold mt-3">{video.title}</h1>

        <div className="grid grid-cols-4 gap-2 mt-6 lg:max-w-2xl">
          <Stat value={formatCount(video.views_count)} label="Vues" tone="brand" />
          <Stat value={video.rating.toFixed(1)} label="Note ★" tone="gold" />
          <Stat value={`${video.satisfaction}%`} label="Satisf." tone="brand" />
          <Stat value={formatDurationLabel(video.duration_seconds)} label="Durée" tone="brand" />
        </div>

        <div className="grid grid-cols-4 gap-2 mt-6">
          <ActionButton
            icon={<Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />}
            label="J'aime"
            onClick={toggleLike}
            active={isLiked}
          />
          <ActionButton
            icon={<Bookmark size={20} fill={isFavorite ? 'currentColor' : 'none'} />}
            label="Enregistrer"
            onClick={toggleFavorite}
            active={isFavorite}
          />
          <ActionButton icon={<Share2 size={20} />} label="Partager" onClick={share} />
          <ActionButton icon={<Download size={20} />} label="Télécharger" onClick={() => {}} />
        </div>

        {video.description && (
          <div className="mt-8">
            <h3 className="text-base font-semibold mb-2">Description</h3>
            <p className="text-sm text-ink-secondary leading-relaxed">{video.description}</p>
          </div>
        )}

        {similar.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Vidéos similaires</h3>
              <Link href="/search" className="text-xs text-brand-500 font-medium">
                Voir tout
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
              {similar.map((v, i) => (
                <div key={v.id} className="w-40 shrink-0">
                  <VideoCard video={v} thumbVariant={((i % 4) + 1) as 1 | 2 | 3 | 4} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5"
    >
      <span
        className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
          active ? 'bg-gradient-brand text-white shadow-glow-sm' : 'bg-surface-700 text-ink-secondary'
        }`}
      >
        {icon}
      </span>
      <span className="text-[11px] text-ink-secondary">{label}</span>
    </button>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: 'brand' | 'gold';
}) {
  const colorClass = tone === 'gold' ? 'text-accent-gold' : 'text-brand-500';
  return (
    <div className="rounded-xl bg-surface-700/60 px-3 py-3 text-center">
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-[11px] text-ink-tertiary mt-0.5">{label}</p>
    </div>
  );
}
