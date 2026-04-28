import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BottomNav from '@/components/BottomNav';
import Sidebar from '@/components/Sidebar';

/**
 * Layout protégé pour les routes /home, /search, /my-list, /profile, /video/[id].
 * Vérifie la session, sinon redirige vers /login.
 *
 * Mobile/Tablette : BottomNav fixe en bas
 * Desktop (lg+) : Sidebar fixe à gauche, contenu décalé de 256px (w-64)
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-dvh page-fade">
      <Sidebar />
      <div className="pb-24 lg:pb-0 lg:pl-64">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
