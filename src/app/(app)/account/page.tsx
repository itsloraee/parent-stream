import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AccountForm from './AccountForm';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <AccountForm
      email={user.email ?? ''}
      profile={{
        username: (profile as any)?.username ?? '',
        full_name: (profile as any)?.full_name ?? '',
        avatar_url: (profile as any)?.avatar_url ?? null,
      }}
    />
  );
}
