import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/types/database';

/**
 * Met à jour la session Supabase et protège les routes privées.
 * Routes publiques : /, /login, /register, /verify, /auth/*, /api/*.
 *
 * Compatible @supabase/ssr v0.5+ avec le pattern getAll/setAll.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/verify' ||
    pathname.startsWith('/auth');

  const isLegalRoute = pathname === '/terms' || pathname === '/privacy';

  const isPublicRoute =
    pathname === '/' || isAuthRoute || isLegalRoute || pathname.startsWith('/api');

  // Redirige vers /login si non authentifié sur route privée
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Redirige vers /home si déjà authentifié sur page d'auth
  if (user && (pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  return response;
}
