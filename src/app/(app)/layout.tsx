import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import BottomNav from '@/components/BottomNav';

/**
 * Layout protégé pour les routes /home, /search, /my-list, /profile, /video/[id].
 * Vérifie la session, sinon redirige vers /login.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-dvh pb-24 page-fade">
      {children}
      <BottomNav />
    </div>
  );
}
