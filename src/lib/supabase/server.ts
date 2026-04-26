import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Client Supabase utilisable côté serveur (Server Components, Route Handlers,
 * Server Actions). Synchronise les cookies via le store Next.js.
 *
 * Compatible Next.js 15+ / 16 où cookies() est async, et @supabase/ssr v0.5+
 * qui utilise le pattern getAll/setAll.
 *
 * IMPORTANT : doit être appelé avec await — `const supabase = await createClient()`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component en lecture seule — le middleware s'occupe du refresh.
          }
        },
      },
    }
  );
}
