'use client';

interface Category {
  slug: string;
  name: string;
  short_label?: string;
}

interface CategoryPillsProps {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
  useShortLabel?: boolean;
}

export default function CategoryPills({
  categories,
  selected,
  onSelect,
  useShortLabel = false,
}: CategoryPillsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
      {categories.map((cat) => {
        const isActive = selected === cat.slug;
        return (
          <button
            key={cat.slug}
            onClick={() => onSelect(cat.slug)}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition ${
              isActive
                ? 'bg-gradient-brand text-white shadow-glow-sm'
                : 'bg-surface-700/70 text-ink-secondary hover:text-ink-primary'
            }`}
          >
            {useShortLabel ? cat.short_label ?? cat.name : cat.name}
          </button>
        );
      })}
    </div>
  );
}
