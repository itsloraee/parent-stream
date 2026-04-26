'use client';

import { Apple, Facebook } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type Provider = 'google' | 'apple' | 'facebook';

export default function OAuthButtons({ label = 'ou continuer avec' }: { label?: string }) {
  const supabase = createClient();

  const handleOAuth = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('OAuth error', error.message);
      alert("La connexion via ce fournisseur n'est pas encore configurée.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-surface-500/60" />
        <span className="text-xs text-ink-tertiary">{label}</span>
        <div className="flex-1 h-px bg-surface-500/60" />
      </div>
      <div className="flex items-center justify-center gap-8">
        <button
          type="button"
          onClick={() => handleOAuth('apple')}
          aria-label="Continuer avec Apple"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-700/60 transition"
        >
          <Apple className="text-white" size={26} fill="white" />
        </button>
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          aria-label="Continuer avec Google"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-700/60 transition"
        >
          <GoogleIcon />
        </button>
        <button
          type="button"
          onClick={() => handleOAuth('facebook')}
          aria-label="Continuer avec Facebook"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-surface-700/60 transition"
        >
          <Facebook className="text-white" size={26} fill="white" stroke="#0B0710" />
        </button>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#FFC107"
        d="M21.8 10.2H12v3.9h5.6c-.5 2.3-2.5 3.9-5.6 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 3.9 1.5l2.8-2.8C16.9 3.2 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.7-.1-1.3-.2-2z"
      />
      <path
        fill="#FF3D00"
        d="M3.4 7.3l3.2 2.3c.9-1.7 2.6-2.9 4.7-2.9 1.5 0 2.9.6 3.9 1.5l2.8-2.8C16.9 3.2 14.6 2.3 12 2.3 8.2 2.3 4.9 4.4 3.4 7.3z"
      />
      <path
        fill="#4CAF50"
        d="M12 21.7c2.5 0 4.7-.9 6.4-2.5l-3-2.5c-.9.6-2 1-3.4 1-3 0-5.6-2-6.5-4.7l-3.2 2.5c1.5 3 4.7 5.2 9.7 5.2z"
      />
      <path
        fill="#1976D2"
        d="M21.8 10.2H12v3.9h5.6c-.3 1.2-1 2.2-2 2.9l3 2.5c1.7-1.6 2.9-4 2.9-7.3 0-.7-.1-1.3-.2-2z"
      />
    </svg>
  );
}
