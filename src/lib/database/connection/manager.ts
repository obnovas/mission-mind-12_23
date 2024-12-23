import { createClient } from '@supabase/supabase-js';
import { getEnvConfig } from '../../../config/env';
import { ConnectionConfig, ConnectionManager } from './types';
import { connectionState } from './state';

const DEFAULT_CONFIG: ConnectionConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
};

export class DatabaseConnectionManager implements ConnectionManager {
  private static instance: DatabaseConnectionManager;
  private client: any;
  private config: ConnectionConfig;

  private constructor(config: Partial<ConnectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public static getInstance(config?: Partial<ConnectionConfig>): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager(config);
    }
    return DatabaseConnectionManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.client) return;

    try {
      const env = getEnvConfig();
      this.client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: { 'x-application-name': 'mission-mind' },
        },
      });

      // Test connection
      const { error } = await this.client.from('user_settings').select('count').limit(1);
      if (error) throw error;

      connectionState.setState({
        isConnected: true,
        error: null,
        lastAttempt: new Date(),
        retryCount: 0,
      });
    } catch (err) {
      connectionState.setState({
        isConnected: false,
        error: err instanceof Error ? err : new Error('Failed to initialize database'),
        lastAttempt: new Date(),
      });
      throw err;
    }
  }

  public getClient() {
    if (!this.client) {
      throw new Error('Database client not initialized');
    }
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.auth.signOut();
      this.client = null;
      connectionState.reset();
    }
  }
}

export const dbClient = DatabaseConnectionManager.getInstance();