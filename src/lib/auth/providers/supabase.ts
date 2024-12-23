import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BaseAuthProvider } from './base';
import { AuthCredentials, AuthResponse } from '../types';
import { getEnvConfig } from '../../../config/env';
import { AuthError } from '../errors';

export class SupabaseAuthProvider extends BaseAuthProvider {
  private client: SupabaseClient;
  private static instance: SupabaseAuthProvider;
  private retryCount: number = 0;
  private readonly MAX_RETRIES = 3;

  private constructor() {
    super();
    const config = getEnvConfig();
    this.client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: window.localStorage,
        storageKey: 'mission-mind-auth',
      },
    });
  }

  public static getInstance(): SupabaseAuthProvider {
    if (!SupabaseAuthProvider.instance) {
      SupabaseAuthProvider.instance = new SupabaseAuthProvider();
    }
    return SupabaseAuthProvider.instance;
  }

  async signOut(): Promise<void> {
    return this.handleAuthOperation(async () => {
      const { error } = await this.client.auth.signOut({
        scope: 'global'
      });
      if (error) throw error;
    });
  }

  private async handleAuthOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const result = await operation();
      this.retryCount = 0; // Reset retry count on success
      return result;
    } catch (err: any) {
      if (err?.status === 500 && this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.handleAuthOperation(operation);
      }
      throw new AuthError(
        err?.message || 'Authentication failed',
        err?.status?.toString() || 'UNKNOWN',
        err
      );
    }
  }

  // ... rest of the implementation
}

export const supabaseAuth = SupabaseAuthProvider.getInstance();