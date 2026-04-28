'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bookmark } from 'lucide-react';

export interface VideoCardData {
  id: string;
  title: string;
  subtitle?: string | null;
  thumbnail_url?: string | null;
  duration_seconds: number;
  progress_percent?: number;
  saved?: boolean;
}

interface VideoCardProps {
  video: VideoCardData;
  variant?: 'default' | 'saved';
  thumbVariant?: 1 | 2 | 3 | 4;
  onToggleSave?: (id: string) => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Détecte si une URL est une thumbnail YouTube : on saute alors l'optimisation
 * Next.js (qui spamme la console quand l'ID est invalide) et on charge en direct.
 */
function isExternalThumbnail(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('ytimg.com') || url.includes('youtube.com');
}

export default function VideoCard({
  video,
  variant = 'default',
  thumbVariant = 1,
  onToggleSave,
}: VideoCardProps) {
  const [imageErrored, setImageErrored] = useState(false);

  const thumbClass =
    thumbVariant === 2 ? 'video-thumb-2' : thumbVariant === 3 ? 'video-thumb-3' : thumbVariant === 4 ? 'video-thumb-4' : 'video-thumb';

  // Si la miniature a 404, on la cache et le dégradé .video-thumb prend le relais
  const showImage = video.thumbnail_url && !imageErrored;

  return (
    <Link href={`/video/${video.id}`} className="block group">
      <div className={`relative aspect-square rounded-2xl overflow-hidden ${thumbClass}`}>
        {showImage && (
          <Image
            src={video.thumbnail_url!}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover"
            unoptimized={isExternalThumbnail(video.thumbnail_url)}
            onError={() => setImageErrored(true)}
          />
        )}

        {/* Durée */}
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 text-[11px] text-white tracking-wider">
          {formatDuration(video.duration_seconds)}
        </span>

        {/* Bookmark badge (variant saved) */}
        {variant === 'saved' && (
          <button
            type="button"
            aria-label="Retirer des favoris"
            onClick={(e) => {
              e.preventDefault();
              onToggleSave?.(video.id);
            }}
            className="absolute right-2.5 top-9 w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm"
          >
            <Bookmark size={16} fill="white" className="text-white" />
          </button>
        )}
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-semibold text-ink-primary truncate">{video.title}</h3>
        {video.subtitle && (
          <p className="text-xs text-ink-tertiary mt-0.5 truncate">{video.subtitle}</p>
        )}
        {/* Progress bar */}
        {typeof video.progress_percent === 'number' && (
          <div className="mt-2 h-1 rounded-full bg-surface-500/40 overflow-hidden">
            <div
              className="h-full bg-gradient-brand"
              style={{ width: `${Math.min(100, Math.max(0, video.progress_percent))}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
