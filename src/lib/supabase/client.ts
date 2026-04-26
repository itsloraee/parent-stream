import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/**
 * Client Supabase utilisable côté navigateur (Client Components).
 * Lit les variables NEXT_PUBLIC_* exposées au browser.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
