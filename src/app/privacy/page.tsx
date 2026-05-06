import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export const metadata = {
  title: 'Politique de confidentialité — Parent Stream',
};

export default function PrivacyPage() {
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
          <Shield size={22} className="text-brand-500" />
          <h1 className="text-2xl lg:text-3xl font-semibold">Politique de confidentialité</h1>
        </div>
      </header>

      <p className="text-xs text-ink-tertiary mb-8">
        Dernière mise à jour : 27 avril 2026
      </p>

      <article className="prose prose-invert max-w-none space-y-6">
        <Section title="1. Données que nous collectons">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Données d&apos;identification : nom, email, mot de passe (chiffré)</li>
            <li>Données d&apos;utilisation : vidéos visionnées, favoris, historique</li>
            <li>Données techniques : adresse IP, type d&apos;appareil, navigateur</li>
            <li>Préférences : centres d&apos;intérêt, paramètres de notification</li>
          </ul>
        </Section>

        <Section title="2. Comment nous utilisons vos données">
          <p>
            Nous utilisons vos données pour fournir le service, personnaliser
            vos recommandations, améliorer la plateforme, vous envoyer des
            communications (que vous pouvez désactiver à tout moment) et
            assurer la sécurité du compte.
          </p>
        </Section>

        <Section title="3. Hébergement & sécurité">
          <p>
            Vos données sont hébergées sur les serveurs Supabase (région UE -
            Paris) et chiffrées au repos. Les mots de passe sont hachés avec
            bcrypt. Nous utilisons les Row Level Security policies de
            PostgreSQL pour garantir que vous seul accédez à vos données.
          </p>
        </Section>

        <Section title="4. Partage de données">
          <p>
            Nous ne vendons jamais vos données. Nous ne les partageons qu&apos;avec :
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>Nos sous-traitants techniques (hébergement, emails)</li>
            <li>Les autorités sur demande légale uniquement</li>
            <li>Personne d&apos;autre, jamais</li>
          </ul>
        </Section>

        <Section title="5. Vos droits (RGPD)">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul className="list-disc list-inside space-y-1 text-sm mt-2">
            <li>Droit d&apos;accès à vos données</li>
            <li>Droit de rectification</li>
            <li>Droit à l&apos;effacement (suppression de votre compte)</li>
            <li>Droit à la portabilité</li>
            <li>Droit d&apos;opposition au traitement</li>
          </ul>
          <p className="mt-3">
            Pour exercer ces droits, écrivez-nous à{' '}
            <span className="text-brand-500">privacy@parent-stream.fr</span>.
          </p>
        </Section>

        <Section title="6. Cookies">
          <p>
            Nous utilisons uniquement des cookies essentiels au fonctionnement
            du service (session d&apos;authentification). Aucun cookie tiers
            de tracking publicitaire.
          </p>
        </Section>

        <Section title="7. Conservation">
          <p>
            Vos données sont conservées tant que votre compte est actif. À la
            suppression du compte, vos données sont effacées sous 30 jours.
            Les données techniques anonymisées peuvent être conservées plus
            longtemps à des fins statistiques.
          </p>
        </Section>

        <Section title="8. Mineurs">
          <p>
            Parent Stream est réservé aux personnes de plus de 16 ans. Nous ne
            collectons pas sciemment de données concernant des mineurs.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Délégué à la protection des données :{' '}
            <span className="text-brand-500">privacy@parent-stream.fr</span>
          </p>
          <p className="mt-2">
            Vous pouvez également déposer une réclamation auprès de la CNIL.
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
