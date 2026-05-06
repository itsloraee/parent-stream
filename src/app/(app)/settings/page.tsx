'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Globe,
  Monitor,
  Eye,
  PlayCircle,
  Moon,
  Trash2,
  ChevronRight,
} from 'lucide-react';

export default function SettingsPage() {
  // États locaux pour la démo (en prod ces préférences seraient stockées en DB)
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [highQuality, setHighQuality] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('fr');
  const [quality, setQuality] = useState('auto');

  return (
    <main className="px-6 pt-12 pb-12 lg:px-12 lg:pt-10 lg:max-w-3xl lg:mx-auto">
      <header className="flex items-center gap-3 mb-8">
        <Link
          href="/profile"
          aria-label="Retour"
          className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center hover:bg-surface-700/70 transition lg:hidden"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl lg:text-3xl font-semibold">Paramètres</h1>
      </header>

      {/* Notifications */}
      <Section
        title="Notifications"
        icon={<Bell size={14} className="text-brand-500" />}
      >
        <Toggle
          label="Notifications push"
          description="Avant-premières et nouvelles vidéos"
          checked={pushNotif}
          onChange={setPushNotif}
        />
        <Toggle
          label="Emails"
          description="Newsletter hebdomadaire et conseils"
          checked={emailNotif}
          onChange={setEmailNotif}
        />
      </Section>

      {/* Lecture */}
      <Section
        title="Lecture"
        icon={<PlayCircle size={14} className="text-brand-500" />}
      >
        <Toggle
          label="Lecture automatique"
          description="Démarre la prochaine vidéo automatiquement"
          checked={autoplay}
          onChange={setAutoplay}
        />
        <Toggle
          label="Haute qualité en wifi"
          description="Vidéos en HD quand vous êtes en wifi"
          checked={highQuality}
          onChange={setHighQuality}
        />
        <SelectRow
          label="Qualité par défaut"
          value={quality}
          options={[
            { value: 'auto', label: 'Automatique' },
            { value: 'sd', label: 'SD (480p)' },
            { value: 'hd', label: 'HD (720p)' },
            { value: 'fhd', label: 'Full HD (1080p)' },
          ]}
          onChange={setQuality}
        />
      </Section>

      {/* Apparence */}
      <Section
        title="Apparence"
        icon={<Monitor size={14} className="text-brand-500" />}
      >
        <Toggle
          label="Mode sombre"
          description="Interface en thème sombre (recommandé)"
          checked={darkMode}
          onChange={setDarkMode}
          icon={<Moon size={16} className="text-accent-purple" />}
        />
        <SelectRow
          label="Langue"
          value={language}
          options={[
            { value: 'fr', label: 'Français' },
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
          ]}
          onChange={setLanguage}
        />
      </Section>

      {/* Confidentialité */}
      <Section
        title="Confidentialité"
        icon={<Eye size={14} className="text-brand-500" />}
      >
        <LinkRow
          icon={<Globe size={18} className="text-ink-secondary" />}
          label="Politique de confidentialité"
          description="Comment nous protégeons vos données"
          href="/privacy"
        />
        <LinkRow
          icon={<Globe size={18} className="text-ink-secondary" />}
          label="Conditions d'utilisation"
          description="Termes et conditions du service"
          href="/terms"
        />
      </Section>

      {/* Zone dangereuse */}
      <section className="mb-6">
        <button
          type="button"
          className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border border-brand-500/30 text-brand-400 hover:bg-brand-900/20 transition"
        >
          <Trash2 size={18} />
          <span className="text-sm font-semibold">Supprimer mon compte</span>
        </button>
        <p className="mt-2 px-2 text-[11px] text-ink-tertiary leading-relaxed">
          Cette action est irréversible. Toutes vos données seront supprimées
          dans un délai de 30 jours.
        </p>
      </section>

      <p className="mt-8 text-center text-[11px] text-ink-tertiary">
        Parent Stream · v1.0.0
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
      <div className="flex items-center gap-2 mb-3 px-2">
        {icon}
        <h2 className="text-xs font-bold text-ink-tertiary uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-surface-700/40">
      {icon && <span className="shrink-0">{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-primary">{label}</p>
        <p className="text-xs text-ink-tertiary mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-12 h-7 rounded-full transition relative ${
          checked ? 'bg-gradient-brand shadow-glow-sm' : 'bg-surface-500/40'
        }`}
      >
        <span
          className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-surface-700/40">
      <p className="flex-1 text-sm font-semibold text-ink-primary">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm text-brand-500 font-semibold outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface-900">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function LinkRow({
  icon,
  label,
  description,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-surface-700/40 hover:bg-surface-700/70 transition"
    >
      <span className="shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-primary">{label}</p>
        <p className="text-xs text-ink-tertiary mt-0.5">{description}</p>
      </div>
      <ChevronRight size={18} className="shrink-0 text-ink-tertiary" />
    </Link>
  );
}
