import { getEnvConfig } from '../../config/env';

export const DB_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
  CONNECTION_TIMEOUT: 5000, // 5 seconds
} as const;

export function getDatabaseConfig() {
  const env = getEnvConfig();
  
  return {
    url: env.supabaseUrl,
    anonKey: env.supabaseAnonKey,
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce' as const,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      global: {
        headers: {
          'x-application-name': 'mission-mind',
        },
      },
    },
  };
}