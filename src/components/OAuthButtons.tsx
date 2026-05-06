'use client';

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
          <AppleIcon />
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
          <FacebookIcon />
        </button>
      </div>
    </div>
  );
}

/**
 * Logo Apple officiel — silhouette de pomme blanche.
 */
function AppleIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

/**
 * Logo Google officiel multicolore.
 */
function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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

/**
 * Logo Facebook officiel — cercle bleu (#1877F2) avec "f" blanc.
 */
function FacebookIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#1877F2"
        d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.469H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z"
      />
      <path
        fill="#FFFFFF"
        d="M16.671 15.469L17.203 12h-3.328V9.749c0-.949.465-1.874 1.956-1.874h1.513V4.922s-1.374-.234-2.686-.234c-2.741 0-4.533 1.661-4.533 4.668V12H7.078v3.469h3.047v8.385a12.118 12.118 0 003.75 0v-8.385h2.796z"
      />
    </svg>
  );
}
