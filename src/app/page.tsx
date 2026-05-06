import Link from 'next/link';
import { ArrowRight, PlayCircle, Sparkles, Heart } from 'lucide-react';
import Logo from '@/components/Logo';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Page d'accueil / Splash screen.
 * Affiché pour tous les utilisateurs (connectés ou non) — c'est la page
 * d'introduction de la plateforme. Les CTA s'adaptent au statut de connexion.
 */
export default async function Index() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  return (
    <main className="min-h-dvh flex flex-col px-6 pt-12 pb-10 page-fade lg:max-w-2xl lg:mx-auto lg:px-8">
      <p className="self-end text-[11px] text-ink-tertiary italic">
        made by @itsloraee
      </p>

      <div className="flex flex-col items-center mt-8 lg:mt-16">
        <Logo />
      </div>

      <div className="flex-1 flex flex-col justify-center mt-12 lg:mt-20">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
          Bienvenue sur <span className="text-brand-500">Parent Stream</span>
        </h1>
        <p className="mt-4 text-base lg:text-lg text-ink-secondary leading-relaxed">
          La plateforme de vidéos qui accompagne les parents au quotidien.
          Conseils, éducation, sommeil, alimentation — tout pour grandir
          ensemble.
        </p>

        <ul className="mt-10 space-y-5">
          <Feature
            icon={<PlayCircle size={20} />}
            title="Des vidéos d'experts"
            description="Catherine Gueguen, Isabelle Filliozat et bien d'autres."
          />
          <Feature
            icon={<Sparkles size={20} />}
            title="Personnalisé pour vous"
            description="Recommandations basées sur l'âge de votre enfant et vos centres d'intérêt."
          />
          <Feature
            icon={<Heart size={20} />}
            title="Une communauté bienveillante"
            description="Échangez avec d'autres parents qui vivent les mêmes défis."
          />
        </ul>
      </div>

      <div className="mt-12 space-y-3">
        {isLoggedIn ? (
          <Link
            href="/home"
            className="w-full py-4 rounded-full bg-gradient-brand text-white font-semibold shadow-glow flex items-center justify-center gap-2 hover:opacity-95 transition"
          >
            Accéder à mon espace
            <ArrowRight size={18} />
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="w-full py-4 rounded-full bg-gradient-brand text-white font-semibold shadow-glow flex items-center justify-center gap-2 hover:opacity-95 transition"
            >
              Commencer
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="w-full py-4 rounded-full bg-surface-700/50 border border-surface-500/40 text-ink-secondary font-semibold flex items-center justify-center hover:text-ink-primary hover:bg-surface-700 transition"
            >
              J&apos;ai déjà un compte
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <li className="flex items-start gap-4">
      <span className="shrink-0 w-10 h-10 rounded-xl bg-brand-900/40 text-brand-500 flex items-center justify-center">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-ink-tertiary mt-0.5 leading-relaxed">{description}</p>
      </div>
    </li>
  );
}
