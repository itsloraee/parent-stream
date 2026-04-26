'use client';

import { useEffect, useState } from 'react';
import CategoryPills from '@/components/CategoryPills';
import VideoCard, { type VideoCardData } from '@/components/VideoCard';
import { createClient } from '@/lib/supabase/client';

interface Category {
  slug: string;
  name: string;
  short_label: string;
}

export default function MyListPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [active, setActive] = useState('tout');
  const [items, setItems] = useState<VideoCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase
        .from('categories')
        .select('slug, name, short_label')
        .order('sort_order', { ascending: true });
      setCategories(cats ?? []);
    })();
  }, [supabase]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      let query = supabase
        .from('favorites')
        .select(
          'created_at, video:videos(id, title, subtitle, duration_seconds, thumbnail_url, category:categories(slug))'
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const { data } = await query;
      let videos = (data ?? [])
        .map((row: any) => ({ ...row.video, _category: row.video?.category?.slug }))
        .filter((v: any) => v && v.id);

      if (active !== 'tout' && active !== 'recents') {
        videos = videos.filter((v: any) => v._category === active);
      }
      if (active === 'recents') {
        videos = videos.slice(0, 8);
      }

      setItems(videos);
      setLoading(false);
    })();
  }, [active, supabase]);

  const filterCategories = [
    { slug: 'tout', name: 'Tout', short_label: 'Tout' },
    { slug: 'recents', name: 'Récents', short_label: 'Récents' },
    ...categories.filter((c) => ['famille', 'sante', 'education'].includes(c.slug)),
  ];

  return (
    <main className="px-6 pt-12">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Ma Liste</h1>
        <p className="text-xs text-ink-tertiary mt-1">{items.length} vidéos sauvegardées</p>
        <p className="absolute right-6 top-14 -translate-y-3 text-[11px] text-ink-tertiary italic">
          made by @itsloraee
        </p>
      </header>

      <CategoryPills
        categories={filterCategories}
        selected={active}
        onSelect={setActive}
        useShortLabel
      />

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink-tertiary text-center py-12">Chargement…</p>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-ink-tertiary">
              Aucune vidéo dans votre liste.
            </p>
            <p className="text-xs text-ink-muted mt-2">
              Appuyez sur l&apos;icône signet pour enregistrer une vidéo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {items.map((v, i) => (
              <VideoCard
                key={v.id}
                video={v}
                variant="saved"
                thumbVariant={((i % 4) + 1) as 1 | 2 | 3 | 4}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
