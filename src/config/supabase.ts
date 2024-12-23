/**
 * Supabase configuration
 */

import { getEnvConfig } from './env';
import { URLs } from './urls';

export { URLs as SupabaseURLs };

export interface SupabaseConfig {
  auth: {
    persistSession: boolean;
    autoRefreshToken: boolean;
    detectSessionInUrl: boolean;
    flowType: 'pkce';
    storage: Storage;
    storageKey: string;
    redirectTo: string;
  };
  global: {
    headers: {
      apikey: string;
      'x-application-name': string;
    };
  };
  db: {
    schema: string;
  };
  realtime: {
    params: {
      eventsPerSecond: number;
    };
  };
}

/**
 * Get Supabase configuration
 */
export function getSupabaseConfig(): SupabaseConfig {
  const env = getEnvConfig();
  const siteUrl = window.location.origin;
  
  return {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: window.localStorage,
      storageKey: 'mission-mind-auth',
      redirectTo: `${siteUrl}/signin`,
    },
    global: {
      headers: {
        apikey: env.supabaseAnonKey,
        'x-application-name': 'mission-mind',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  };
}