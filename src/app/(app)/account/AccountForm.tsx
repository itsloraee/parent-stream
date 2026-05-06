'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, Mail, Lock, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  email: string;
  profile: {
    username: string;
    full_name: string;
    avatar_url: string | null;
  };
}

export default function AccountForm({ email, profile }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState(profile.full_name);
  const [username, setUsername] = useState(profile.username);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initial =
    fullName?.[0]?.toUpperCase() ?? username?.[0]?.toUpperCase() ?? 'U';

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError('Session expirée');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, username })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 2400);
    }
    setSaving(false);
  };

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
        <h1 className="text-2xl lg:text-3xl font-semibold">Mon compte</h1>
      </header>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex flex-col items-center mb-2">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center text-4xl font-semibold border-4 border-brand-500/30">
              {initial}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow-sm"
              aria-label="Changer la photo"
            >
              <Camera size={16} className="text-white" />
            </button>
          </div>
          <p className="mt-3 text-xs text-ink-tertiary">JPG ou PNG, 5 Mo max</p>
        </div>

        <Field
          label="NOM ET PRÉNOM"
          value={fullName}
          onChange={setFullName}
          placeholder="Loraee"
        />

        <Field
          label="NOM D'UTILISATEUR"
          value={username}
          onChange={setUsername}
          placeholder="itsloraee"
          prefix="@"
        />

        <div>
          <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
            Adresse email
          </label>
          <div className="rounded-full bg-surface-700/40 px-5 py-3 flex items-center gap-3">
            <Mail size={16} className="text-ink-tertiary" />
            <span className="flex-1 text-sm text-ink-secondary">{email}</span>
            <span className="text-[10px] uppercase tracking-wider text-ink-tertiary">
              Vérifié
            </span>
          </div>
          <p className="mt-2 text-[11px] text-ink-tertiary">
            Pour modifier votre email, contactez le support.
          </p>
        </div>

        <Link
          href="/account/password"
          className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface-700/40 hover:bg-surface-700/70 transition"
        >
          <span className="flex items-center gap-3">
            <Lock size={18} className="text-brand-500" />
            <span>
              <span className="block text-sm font-semibold">Mot de passe</span>
              <span className="block text-xs text-ink-tertiary mt-0.5">
                Modifier votre mot de passe
              </span>
            </span>
          </span>
          <ArrowLeft size={16} className="rotate-180 text-ink-tertiary" />
        </Link>

        {error && <p className="text-sm text-brand-400 text-center">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full mt-4 py-3.5 rounded-full bg-gradient-brand text-white font-semibold shadow-glow disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {success ? (
            <>
              <Check size={18} /> Enregistré
            </>
          ) : saving ? (
            'Enregistrement…'
          ) : (
            'Enregistrer les modifications'
          )}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  prefix?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
        {label}
      </label>
      <div className="rounded-full border border-brand-500 bg-surface-900/40 px-5 py-3 input-glow flex items-center gap-2">
        {prefix && <span className="text-ink-tertiary text-sm">{prefix}</span>}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-ink-secondary placeholder:text-ink-tertiary outline-none"
        />
      </div>
    </div>
  );
}
