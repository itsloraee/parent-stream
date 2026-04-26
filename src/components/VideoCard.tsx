'use client';

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

export default function VideoCard({
  video,
  variant = 'default',
  thumbVariant = 1,
  onToggleSave,
}: VideoCardProps) {
  const thumbClass =
    thumbVariant === 2 ? 'video-thumb-2' : thumbVariant === 3 ? 'video-thumb-3' : thumbVariant === 4 ? 'video-thumb-4' : 'video-thumb';

  return (
    <Link href={`/video/${video.id}`} className="block group">
      <div className={`relative aspect-square rounded-2xl overflow-hidden ${thumbClass}`}>
        {video.thumbnail_url && (
          <Image
            src={video.thumbnail_url}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover"
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
