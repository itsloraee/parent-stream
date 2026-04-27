'use client';

import { Suspense, useState, useEffect, useRef, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/client';

const CODE_LENGTH = 8;

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <VerifyForm />
    </Suspense>
  );
}

function VerifyFallback() {
  return (
    <main className="min-h-dvh flex flex-col px-6 pt-12 pb-10 page-fade">
      <div className="flex flex-col items-center mb-16">
        <Logo />
      </div>
    </main>
  );
}

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const email = searchParams.get('email') ?? '';

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste flow
      const pasted = value.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
      const next = [...code];
      pasted.forEach((d, i) => {
        if (index + i < CODE_LENGTH) next[index + i] = d;
      });
      setCode(next);
      const nextIndex = Math.min(index + pasted.length, CODE_LENGTH - 1);
      inputs.current[nextIndex]?.focus();
      return;
    }
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    const token = code.join('');
    if (token.length !== CODE_LENGTH) {
      setError(`Veuillez saisir les ${CODE_LENGTH} chiffres`);
      return;
    }
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) {
      setError("Code invalide ou expiré.");
      setLoading(false);
      return;
    }

    router.push('/home');
    router.refresh();
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    await supabase.auth.resend({ type: 'signup', email });
    setResending(false);
    setError(null);
  };

  // Auto-submit quand le code est complet
  useEffect(() => {
    if (code.every((d) => d !== '') && !loading) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <main className="min-h-dvh flex flex-col px-6 pt-12 pb-10 page-fade">
      <p className="self-end text-[11px] text-ink-tertiary italic mb-12">
        made by @itsloraee
      </p>

      <div className="flex flex-col items-center mb-16">
        <Logo />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <div className="flex justify-center gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={CODE_LENGTH}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-9 h-12 text-center text-lg font-semibold rounded-xl bg-surface-700 outline-none transition ${
                digit
                  ? 'border-2 border-brand-500'
                  : 'border border-surface-500/40'
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-brand-400 text-center">{error}</p>
        )}

        <p className="text-sm text-ink-tertiary mt-4">
          Vous n&apos;avez pas reçu le code ?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="text-brand-500 font-semibold disabled:opacity-50"
          >
            {resending ? 'Envoi…' : 'Renvoyer'}
          </button>
        </p>

        {loading && (
          <p className="text-xs text-ink-tertiary">Vérification en cours…</p>
        )}
      </form>
    </main>
  );
}
