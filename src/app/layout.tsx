import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Parent Stream — Votre plateforme dédiée à la parentalité',
  description:
    'Parent Stream : la plateforme de vidéos informatives pour accompagner les parents au quotidien. Conseils, éducation, santé, sommeil, alimentation.',
  keywords: ['parentalité', 'éducation', 'parents', 'vidéos', 'conseils enfants'],
  authors: [{ name: 'itsloraee' }],
  openGraph: {
    title: 'Parent Stream',
    description: 'Votre plateforme dédiée à la parentalité',
    type: 'website',
    locale: 'fr_FR',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0710',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={poppins.variable}>
      <body className="font-sans antialiased text-ink-primary">
        {/*
         * Conteneur responsive :
         * - Mobile/Tablette (< lg) : cadre mobile centré max-w-md avec dégradé
         * - Desktop (lg+) : pleine largeur, le dégradé reste contenu via .mobile-frame
         */}
        <div className="mobile-frame relative mx-auto w-full max-w-md lg:max-w-none min-h-dvh shadow-2xl shadow-black/60 lg:shadow-none">
          {children}
        </div>
      </body>
    </html>
  );
}
