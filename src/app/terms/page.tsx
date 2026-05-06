import Link from 'next/link';
import { ArrowLeft, ScrollText } from 'lucide-react';

export const metadata = {
  title: "Conditions d'utilisation — Parent Stream",
};

export default function TermsPage() {
  return (
    <main className="px-6 pt-12 pb-12 lg:px-12 lg:pt-10 lg:max-w-3xl lg:mx-auto">
      <header className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          aria-label="Retour"
          className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center hover:bg-surface-700/70 transition"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <ScrollText size={22} className="text-brand-500" />
          <h1 className="text-2xl lg:text-3xl font-semibold">Conditions d&apos;utilisation</h1>
        </div>
      </header>

      <p className="text-xs text-ink-tertiary mb-8">
        Dernière mise à jour : 27 avril 2026
      </p>

      <article className="prose prose-invert max-w-none space-y-6">
        <Section title="1. Acceptation des conditions">
          <p>
            En accédant à Parent Stream, vous acceptez d&apos;être lié par les
            présentes conditions d&apos;utilisation. Si vous n&apos;acceptez
            pas l&apos;intégralité de ces conditions, vous ne pouvez pas
            utiliser nos services.
          </p>
        </Section>

        <Section title="2. Description du service">
          <p>
            Parent Stream est une plateforme de vidéos informatives dédiée à la
            parentalité. Nous proposons des contenus produits par des experts
            (psychologues, pédiatres, éducateurs) pour accompagner les parents
            au quotidien.
          </p>
        </Section>

        <Section title="3. Inscription et compte">
          <p>
            Pour accéder à certaines fonctionnalités, vous devez créer un
            compte. Vous êtes responsable de la confidentialité de vos
            identifiants. Vous devez être âgé d&apos;au moins 16 ans pour vous
            inscrire.
          </p>
        </Section>

        <Section title="4. Contenu utilisateur">
          <p>
            En partageant du contenu sur Parent Stream (commentaires, listes
            personnelles, messages), vous nous accordez une licence
            non-exclusive d&apos;utilisation à des fins de fourniture du
            service. Vous restez propriétaire de votre contenu.
          </p>
        </Section>

        <Section title="5. Comportements interdits">
          <p>
            Sont interdits : tout contenu illégal, diffamatoire, harcelant ou
            inapproprié pour un environnement familial ; le partage
            d&apos;identifiants ; la tentative de contournement des mesures
            de sécurité ; la collecte automatisée de données.
          </p>
        </Section>

        <Section title="6. Propriété intellectuelle">
          <p>
            Tous les contenus de Parent Stream (vidéos, design, code, marques)
            sont protégés par le droit d&apos;auteur. Aucune reproduction
            n&apos;est autorisée sans autorisation préalable.
          </p>
        </Section>

        <Section title="7. Limitation de responsabilité">
          <p>
            Les contenus présentés sur Parent Stream sont à visée éducative et
            ne se substituent pas à un avis médical, psychologique ou juridique
            professionnel. En cas de doute, consultez un professionnel.
          </p>
        </Section>

        <Section title="8. Modification des conditions">
          <p>
            Nous nous réservons le droit de modifier les présentes conditions
            à tout moment. Vous serez informé par email et invité à accepter
            les nouvelles conditions à votre prochaine connexion.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Pour toute question, contactez-nous à{' '}
            <span className="text-brand-500">contact@parent-stream.fr</span>.
          </p>
        </Section>
      </article>

      <p className="mt-12 text-center text-[11px] text-ink-tertiary italic">
        Parent Stream · made with ❤️ par @itsloraee
      </p>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-ink-primary mb-2">{title}</h2>
      <div className="text-sm text-ink-secondary leading-relaxed">{children}</div>
    </div>
  );
}
