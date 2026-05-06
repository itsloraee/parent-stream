'use client';

import { useState, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Lock, Check, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function passwordStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const label = ['Faible', 'Faible', 'Moyen', 'Fort', 'Très fort'][score];
  return { score: score as 0 | 1 | 2 | 3 | 4, label };
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(newPassword), [newPassword]);
  const passwordsMatch = !confirmPassword || confirmPassword === newPassword;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!passwordsMatch) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (strength.score < 2) {
      setError('Mot de passe trop faible (minimum : moyen)');
      return;
    }
    if (newPassword === currentPassword) {
      setError('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setLoading(true);

    // Étape 1 : vérifier le mot de passe actuel en tentant une re-authentification
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      setError('Session expirée');
      setLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) {
      setError('Mot de passe actuel incorrect');
      setLoading(false);
      return;
    }

    // Étape 2 : mettre à jour le mot de passe
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // Retour automatique à la page compte après 2s
    setTimeout(() => router.push('/account'), 2000);
  };

  return (
    <main className="px-6 pt-12 pb-12 lg:px-12 lg:pt-10 lg:max-w-2xl lg:mx-auto">
      <header className="flex items-center gap-3 mb-8">
        <Link
          href="/account"
          aria-label="Retour"
          className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center hover:bg-surface-700/70 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <Lock size={22} className="text-brand-500" />
          <h1 className="text-2xl lg:text-3xl font-semibold">Mot de passe</h1>
        </div>
      </header>

      <p className="text-sm text-ink-tertiary mb-8 leading-relaxed">
        Choisissez un mot de passe robuste avec au moins 8 caractères,
        majuscules, minuscules et chiffres.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <PasswordField
          label="MOT DE PASSE ACTUEL"
          value={currentPassword}
          onChange={setCurrentPassword}
          autoComplete="current-password"
        />

        <div>
          <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
            NOUVEAU MOT DE PASSE
          </label>
          <div className="rounded-full border border-brand-500 bg-surface-900/40 px-5 py-3 input-glow">
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full bg-transparent text-sm text-ink-secondary outline-none tracking-widest"
            />
          </div>
          {newPassword && <PasswordStrengthBar score={strength.score} label={strength.label} />}
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
            CONFIRMER
          </label>
          <div className="rounded-full bg-surface-700 px-5 py-3">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full bg-transparent text-sm text-ink-secondary outline-none tracking-widest"
            />
          </div>
          {!passwordsMatch && (
            <p className="mt-2 flex items-center gap-2 text-xs text-amber-400 italic">
              <AlertTriangle size={14} />
              Les mots de passe ne correspondent pas
            </p>
          )}
        </div>

        {error && <p className="text-sm text-brand-400 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3.5 rounded-full bg-gradient-brand text-white font-semibold shadow-glow disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {success ? (
            <>
              <Check size={18} /> Mot de passe modifié
            </>
          ) : loading ? (
            'Enregistrement…'
          ) : (
            'Modifier le mot de passe'
          )}
        </button>
      </form>
    </main>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
        {label}
      </label>
      <div className="rounded-full bg-surface-700 px-5 py-3">
        <input
          type="password"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-ink-secondary outline-none tracking-widest"
        />
      </div>
    </div>
  );
}

function PasswordStrengthBar({ score, label }: { score: 0 | 1 | 2 | 3 | 4; label: string }) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex-1 grid grid-cols-4 gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 rounded-full ${
              i < score ? 'bg-emerald-400' : 'bg-surface-500/60'
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold text-emerald-400">{label}</span>
    </div>
  );
}
