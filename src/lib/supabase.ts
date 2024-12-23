import { createClient } from '@supabase/supabase-js';
import { handleError } from './supabase/errors';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'apikey': supabaseAnonKey,
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

// Add connection health check
export const checkConnection = async () => {
  try {
    const { error } = await supabase.from('user_settings').select('count').limit(1);
    return !error;
  } catch (err) {
    console.error('Database connection check failed:', err);
    return false;
  }
};

// Export error handler
export { handleError };

// Add request handler
export async function handleSupabaseRequest<T>(request: Promise<{ data: T; error: any }>): Promise<T> {
  try {
    const { data, error } = await request;
    if (error) throw error;
    return data;
  } catch (err) {
    throw handleError(err);
  }
}