'use client';

import { Suspense, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import OAuthButtons from '@/components/OAuthButtons';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <main className="min-h-dvh flex flex-col px-6 pt-12 pb-10 page-fade">
      <div className="flex flex-col items-center mb-12">
        <Logo />
      </div>
    </main>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    const redirectTo = searchParams.get('redirectTo') ?? '/home';
    router.push(redirectTo);
    router.refresh();
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
        <h2 className="text-2xl font-semibold mb-8">Connexion</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
              Email
            </label>
            <div className="rounded-full border border-brand-500 bg-surface-900/40 px-5 py-3 input-glow">
              <input
                type="email"
                required
                placeholder="ITSLORAEE@MAIL.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-ink-secondary placeholder:text-ink-tertiary outline-none uppercase tracking-wider"
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] tracking-[0.2em] text-ink-tertiary uppercase mb-2">
              Mot de passe
            </label>
            <div className="rounded-full bg-surface-700 px-5 py-3">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-ink-secondary outline-none tracking-widest"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-brand-400 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-full bg-gradient-brand text-white font-semibold shadow-glow disabled:opacity-50 transition"
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-10">
          <OAuthButtons />
        </div>

        <p className="mt-10 text-center text-sm text-ink-secondary">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-brand-500 font-semibold">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}
