import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for the frontend (browser).
 *
 * Uses ONLY the publishable (anon) key — never the service_role key.
 * Auth is handled entirely by Supabase Auth; this client is safe to ship in
 * the production bundle. Session persistence is managed by Supabase Auth.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
