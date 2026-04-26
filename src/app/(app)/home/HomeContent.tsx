'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import CategoryPills from '@/components/CategoryPills';
import VideoCard, { type VideoCardData } from '@/components/VideoCard';

interface Category {
  slug: string;
  name: string;
  short_label: string;
}

interface HeroSeries {
  id: string;
  title: string;
  rating: number;
  is_new: boolean;
}

interface HomeContentProps {
  categories: Category[];
  heroSeries: HeroSeries | null;
  continueWatching: (VideoCardData & { progress_percent: number })[];
  recommended: VideoCardData[];
}

export default function HomeContent({
  categories,
  heroSeries,
  continueWatching,
  recommended,
}: HomeContentProps) {
  const [activeCategory, setActiveCategory] = useState('tout');

  const categoryList = useMemo(
    () => [{ slug: 'tout', name: 'Tout', short_label: 'Tout' }, ...categories],
    [categories]
  );

  return (
    <>
      <CategoryPills
        categories={categoryList}
        selected={activeCategory}
        onSelect={setActiveCategory}
      />

      {/* Hero */}
      {heroSeries && (
        <Link
          href={`/video/${heroSeries.id}`}
          className="block mt-6 relative h-56 rounded-2xl overflow-hidden video-thumb"
        >
          <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-gradient-brand text-[11px] font-semibold tracking-wider">
            FAMILLE
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-hero">
            <h2 className="text-xl font-bold mb-1">{heroSeries.title}</h2>
            <p className="text-xs text-ink-secondary">
              45 min · {heroSeries.rating.toFixed(1)} ·{' '}
              {heroSeries.is_new && <span>Nouvelle saison</span>}
            </p>
          </div>
        </Link>
      )}

      {/* Continuer à regarder */}
      {continueWatching.length > 0 && (
        <section className="mt-8">
          <SectionHeader title="Continuer à regarder" href="/my-list" />
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
            {continueWatching.map((v, i) => (
              <div key={v.id} className="w-40 shrink-0">
                <VideoCard
                  video={v}
                  thumbVariant={((i % 4) + 1) as 1 | 2 | 3 | 4}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommandé pour vous */}
      <section className="mt-8">
        <SectionHeader title="Recommandé pour vous" href="/search" />
        <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
          {recommended.map((v, i) => (
            <div key={v.id} className="w-40 shrink-0">
              <VideoCard
                video={v}
                thumbVariant={((i % 4) + 1) as 1 | 2 | 3 | 4}
              />
            </div>
          ))}
        </div>
      </section>

      {recommended.length === 0 && continueWatching.length === 0 && (
        <p className="mt-12 text-center text-sm text-ink-tertiary">
          Aucune vidéo disponible. Lancez les seeds Supabase pour voir des données de démo.
        </p>
      )}
    </>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-base font-semibold">{title}</h3>
      <Link href={href} className="text-xs text-brand-500 font-medium">
        Voir tout
      </Link>
    </div>
  );
}
