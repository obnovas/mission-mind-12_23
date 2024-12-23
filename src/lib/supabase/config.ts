import { createClient } from '@supabase/supabase-js';
import { getEnvConfig } from '../../config/env';

const env = getEnvConfig();

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'apikey': env.supabaseAnonKey,
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
});

// Add error handling wrapper
export async function handleSupabaseRequest<T>(
  request: Promise<{ data: T; error: any }>
): Promise<T> {
  try {
    const { data, error } = await request;
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Supabase request failed:', err);
    throw new Error('Failed to connect to database. Please try again.');
  }
}