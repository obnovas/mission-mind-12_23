/**
 * Environment variable configuration and validation
 */

export interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export function getEnvConfig(): EnvConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ''),
    supabaseAnonKey,
  };
}