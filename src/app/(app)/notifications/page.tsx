'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Calendar,
  Play,
  Heart,
  BookmarkPlus,
  MessageCircle,
  Bell,
  CheckCheck,
} from 'lucide-react';

type NotificationItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  time: string;
  unread?: boolean;
  cta?: string;
  ctaTone?: 'brand' | 'muted';
};

const upcoming: NotificationItem[] = [
  {
    id: 'u1',
    icon: <Sparkles size={18} />,
    title: 'Avant-première : Sommeil & adolescence',
    description: 'Une nouvelle série exclusive disponible le 5 mai 2026.',
    time: 'Dans 6 jours',
    cta: 'Activer le rappel',
    ctaTone: 'brand',
  },
  {
    id: 'u2',
    icon: <Calendar size={18} />,
    title: 'Coming soon : Alimentation 6-12 mois',
    description: 'La saison 2 arrive bientôt avec 8 nouveaux épisodes.',
    time: 'Mai 2026',
  },
  {
    id: 'u3',
    icon: <Sparkles size={18} />,
    title: 'Live exclusif avec Catherine Gueguen',
    description: 'Une session questions-réponses en direct sur les neurosciences.',
    time: '12 juin 2026',
    cta: 'M\'inscrire',
    ctaTone: 'brand',
  },
];

const recent: NotificationItem[] = [
  {
    id: 'r1',
    icon: <Play size={18} />,
    title: 'Nouvelle vidéo disponible',
    description: '"Comprendre les colères chez les 2-4 ans"',
    time: 'Il y a 2h',
    unread: true,
  },
  {
    id: 'r2',
    icon: <Heart size={18} />,
    title: 'Recommandation personnalisée',
    description: '"L\'art d\'écouter son enfant" basé sur vos vidéos likées.',
    time: 'Il y a 5h',
    unread: true,
  },
  {
    id: 'r3',
    icon: <BookmarkPlus size={18} />,
    title: 'Sélection de la semaine',
    description: '5 vidéos pour mieux gérer les écrans à la maison.',
    time: 'Hier',
    unread: true,
  },
  {
    id: 'r4',
    icon: <MessageCircle size={18} />,
    title: 'Nouveau commentaire sur votre liste',
    description: 'Sophie a commenté votre vidéo favorite.',
    time: 'Il y a 2 jours',
  },
];

const past: NotificationItem[] = [
  {
    id: 'p1',
    icon: <Play size={18} />,
    title: 'Continuer "L\'éveil 0-3 ans"',
    description: 'Vous avez démarré cette vidéo il y a 10 jours.',
    time: 'Il y a 1 semaine',
  },
  {
    id: 'p2',
    icon: <Sparkles size={18} />,
    title: 'Bienvenue sur Parent Stream',
    description: 'Découvrez votre première série recommandée.',
    time: 'Il y a 2 semaines',
  },
  {
    id: 'p3',
    icon: <BookmarkPlus size={18} />,
    title: 'Votre liste s\'agrandit',
    description: 'Vous avez maintenant 5 vidéos enregistrées.',
    time: 'Il y a 3 semaines',
  },
];

export default function NotificationsPage() {
  const [readAll, setReadAll] = useState(false);

  const unreadCount = recent.filter((n) => n.unread && !readAll).length;

  return (
    <main className="px-6 pt-12 pb-12 lg:px-12 lg:pt-10 lg:max-w-4xl lg:mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            aria-label="Retour"
            className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center hover:bg-surface-700/70 transition lg:hidden"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-semibold flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-brand">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => setReadAll(true)}
            className="flex items-center gap-1.5 text-xs text-brand-500 font-semibold hover:text-brand-400 transition"
          >
            <CheckCheck size={14} />
            Tout marquer comme lu
          </button>
        )}
      </header>

      {/* À venir */}
      <Section
        title="À venir"
        icon={<Sparkles size={14} className="text-accent-purple" />}
      >
        {upcoming.map((n) => (
          <NotificationCard key={n.id} notification={n} variant="upcoming" />
        ))}
      </Section>

      {/* Récentes */}
      <Section
        title="Récentes"
        icon={<Bell size={14} className="text-brand-500" />}
      >
        {recent.map((n) => (
          <NotificationCard
            key={n.id}
            notification={{ ...n, unread: n.unread && !readAll }}
            variant="recent"
          />
        ))}
      </Section>

      {/* Passées */}
      <Section
        title="Passées"
        icon={<CheckCheck size={14} className="text-ink-tertiary" />}
      >
        {past.map((n) => (
          <NotificationCard key={n.id} notification={n} variant="past" />
        ))}
      </Section>

      <p className="mt-8 text-center text-xs text-ink-tertiary">
        Vous n&apos;avez plus de notifications anciennes.
      </p>
    </main>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <ul className="space-y-2.5">{children}</ul>
    </section>
  );
}

function NotificationCard({
  notification,
  variant,
}: {
  notification: NotificationItem;
  variant: 'upcoming' | 'recent' | 'past';
}) {
  const { icon, title, description, time, unread, cta, ctaTone } = notification;

  const iconBg =
    variant === 'upcoming'
      ? 'bg-accent-purple/20 text-accent-purple'
      : variant === 'recent'
        ? 'bg-brand-900/40 text-brand-500'
        : 'bg-surface-500/30 text-ink-tertiary';

  return (
    <li>
      <div
        className={`relative flex items-start gap-4 px-4 py-4 rounded-2xl transition ${
          unread ? 'bg-surface-700 ring-1 ring-brand-500/20' : 'bg-surface-700/40'
        }`}
      >
        {unread && (
          <span
            aria-hidden
            className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-500 shadow-glow-sm"
          />
        )}

        <span
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </span>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-snug ${
              variant === 'past' ? 'text-ink-secondary' : 'font-semibold text-ink-primary'
            }`}
          >
            {title}
          </p>
          <p className="text-xs text-ink-tertiary mt-0.5 leading-relaxed">{description}</p>
          <div className="flex items-center justify-between mt-2 gap-3">
            <span className="text-[11px] text-ink-tertiary">{time}</span>
            {cta && (
              <button
                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition ${
                  ctaTone === 'brand'
                    ? 'bg-gradient-brand text-white shadow-glow-sm'
                    : 'bg-surface-500/40 text-ink-secondary hover:text-ink-primary'
                }`}
              >
                {cta}
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
