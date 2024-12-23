import { SupabaseClient } from '@supabase/supabase-js';

export interface DatabaseClient extends SupabaseClient {
  isConnected(): boolean;
  getLastError(): Error | null;
}

export interface ConnectionState {
  isConnected: boolean;
  error: Error | null;
  lastAttempt: Date | null;
  retryCount: number;
}

export interface ConnectionOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}