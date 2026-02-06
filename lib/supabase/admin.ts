import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Admin client with service role key - bypasses RLS.
 * Use ONLY in server-side API routes for auth operations.
 * Never expose this client to the browser.
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local for auth operations.');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
