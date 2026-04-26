'use client';

import { useState, FormEvent, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import Logo from '@/components/Logo';
import OAuthButtons from '@/components/OAuthButtons';
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

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const passwordsMatch = !confirmPassword || confirmPassword === password;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordsMatch) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (strength.score < 2) {
      setError('Mot de passe trop faible (minimum : moyen)');
      return;
    }

    setLoading(true);
    const username = email.split('@')[0];
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/verify?email=${encodeURIComponent(email)}`);
  };

  return (
    <main className="min-h-dvh flex flex-col px-6 pt-12 pb-10 page-fade">
      <p className="self-end text-[11px] text-ink-tertiary italic mb-8">
        made by @itsloraee
      </p>

      <div className="flex flex-col items-center mb-12">
        <Logo />
      </div>

      <div className="flex-1 flex flex-col">
        <h2 className="text-3xl font-semibold mb-2">Inscription</h2>
        <p className="text-sm text-ink-secondary mb-8">Rejoignez la communauté</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field
            label="NOM ET PRENOM"
            type="text"
            required
            value={fullName}
            onChange={setFullName}
            placeholder="Loraee"
            autoComplete="name"
          />
          <Field
            label="ADRESSE EMAIL"
            type="email"
            required
            value={email}
            onChange={setEmail}
            placeholder="itsloraee@mail.com"
            autoComplete="email"
          />

          <div>
            <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
              Mot de passe
            </label>
            <div className="rounded-full border border-brand-500 bg-surface-900/40 px-5 py-3 input-glow">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-ink-secondary outline-none tracking-widest"
                autoComplete="new-password"
              />
            </div>
            {password && <PasswordStrengthBar score={strength.score} label={strength.label} />}
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
              Confirmer le mot de passe
            </label>
            <div className="rounded-full bg-surface-700 px-5 py-3">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-ink-secondary outline-none tracking-widest"
                autoComplete="new-password"
              />
            </div>
            {!passwordsMatch && (
              <p className="mt-2 flex items-center gap-2 text-xs text-amber-400 italic">
                <AlertTriangle size={14} />
                Les mots de passe ne correspondent pas
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-brand-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-4 rounded-full bg-gradient-brand text-white font-semibold shadow-glow disabled:opacity-50 transition"
          >
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-tertiary">
          En créant un compte vous acceptez nos{' '}
          <span className="text-brand-500">Conditions d&apos;utilisation</span> et notre{' '}
          <span className="text-brand-500">Politique de confidentialité</span>
        </p>

        <div className="mt-8">
          <OAuthButtons label="ou s'inscrire avec" />
        </div>

        <p className="mt-8 text-center text-sm text-ink-secondary">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-brand-500 font-semibold">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}

interface FieldProps {
  label: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}

function Field({ label, type, required, value, onChange, placeholder, autoComplete }: FieldProps) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
        {label}
      </label>
      <div className="rounded-full border border-brand-500 bg-surface-900/40 px-5 py-3 input-glow">
        <input
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm text-ink-secondary placeholder:text-ink-tertiary outline-none"
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
