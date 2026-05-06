import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Redirige vers la racine pour que le splash screen s'affiche après déconnexion
  return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}
