'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import VideoCard, { type VideoCardData } from '@/components/VideoCard';
import { createClient } from '@/lib/supabase/client';

const TRENDING = ['Parentalité', 'Éveil', 'Sommeil', 'Alimentation', 'Ados'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<VideoCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const runSearch = useCallback(
    async (q: string) => {
      setLoading(true);
      let request = supabase
        .from('videos')
        .select('id, title, subtitle, duration_seconds, thumbnail_url')
        .eq('is_published', true)
        .order('views_count', { ascending: false })
        .limit(24);

      if (q.trim()) {
        request = request.ilike('title', `%${q}%`);
      }

      const { data } = await request;
      setResults(data ?? []);
      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    const t = setTimeout(() => runSearch(query), 250);
    return () => clearTimeout(t);
  }, [query, runSearch]);

  return (
    <main className="px-6 pt-12 lg:px-12 lg:pt-10 lg:max-w-7xl lg:mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-semibold">Rechercher</h1>
        <p className="lg:hidden absolute right-6 top-3 text-[10px] text-ink-tertiary italic">
          made by @itsloraee
        </p>
      </header>

      <div className="rounded-full border border-brand-500 bg-surface-900/40 px-5 py-3 flex items-center gap-3 input-glow">
        <SearchIcon size={18} className="text-ink-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Aider son enfant pour les devoirs"
          className="flex-1 bg-transparent text-sm text-ink-secondary placeholder:text-ink-secondary outline-none"
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Effacer">
            <X size={18} className="text-ink-secondary" />
          </button>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-3">
          Tendances
        </h3>
        <div className="flex flex-wrap gap-2">
          {TRENDING.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-4 py-1.5 rounded-full bg-surface-700/70 text-xs text-ink-secondary hover:text-ink-primary"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-4">
          Résultats <span className="text-ink-tertiary">— {results.length} vidéos</span>
        </h3>
        {loading ? (
          <p className="text-sm text-ink-tertiary">Recherche…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.map((v, i) => (
              <VideoCard
                key={v.id}
                video={{ ...v, progress_percent: ((i * 17) % 80) + 10 }}
                thumbVariant={((i % 4) + 1) as 1 | 2 | 3 | 4}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
