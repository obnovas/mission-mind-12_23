import { createClient } from '@supabase/supabase-js';
import { DB_CONFIG, getDatabaseConfig } from './config';
import { DatabaseClient, ConnectionOptions } from './types';
import { connectionState } from './state';
import { handleDatabaseError } from './errors';

export class DatabaseClientManager {
  private static instance: DatabaseClientManager;
  private client: DatabaseClient | null = null;
  private connectionTimeout: NodeJS.Timeout | null = null;
  private retryAttempt = 0;

  private constructor() {}

  public static getInstance(): DatabaseClientManager {
    if (!DatabaseClientManager.instance) {
      DatabaseClientManager.instance = new DatabaseClientManager();
    }
    return DatabaseClientManager.instance;
  }

  public async initialize(options: ConnectionOptions = {}): Promise<DatabaseClient> {
    if (this.client) {
      return this.client;
    }

    const config = getDatabaseConfig();
    const {
      maxRetries = DB_CONFIG.MAX_RETRIES,
      retryDelay = DB_CONFIG.RETRY_DELAY,
      timeout = DB_CONFIG.CONNECTION_TIMEOUT,
    } = options;

    // Create base client
    const baseClient = createClient(config.url, config.anonKey, config.options);

    // Enhance client with additional methods
    this.client = {
      ...baseClient,
      isConnected: () => connectionState.getState().isConnected,
      getLastError: () => connectionState.getState().error,
    };

    // Set connection timeout
    this.connectionTimeout = setTimeout(() => {
      if (!connectionState.getState().isConnected) {
        connectionState.setState({
          error: new Error('Connection timeout exceeded'),
          lastAttempt: new Date(),
        });
      }
    }, timeout);

    try {
      // Test connection
      const { error } = await this.client.from('user_settings').select('count').limit(1);
      
      if (error) {
        throw error;
      }

      connectionState.setState({
        isConnected: true,
        error: null,
        lastAttempt: new Date(),
        retryCount: 0,
      });

      return this.client;
    } catch (err) {
      const currentState = connectionState.getState();
      
      if (this.retryAttempt < maxRetries) {
        // Retry connection with exponential backoff
        this.retryAttempt++;
        connectionState.setState({
          retryCount: this.retryAttempt,
          lastAttempt: new Date(),
        });

        const backoffDelay = retryDelay * Math.pow(2, this.retryAttempt - 1);
        await new Promise(resolve => setTimeout(resolve, backoffDelay));
        return this.initialize(options);
      }

      const error = handleDatabaseError(err);
      connectionState.setState({
        error,
        isConnected: false,
        lastAttempt: new Date(),
      });
      throw error;
    } finally {
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
        this.connectionTimeout = null;
      }
    }
  }

  public getClient(): DatabaseClient {
    if (!this.client) {
      throw new Error('Database client not initialized');
    }
    return this.client;
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.auth.signOut();
      this.client = null;
      this.retryAttempt = 0;
      connectionState.reset();
    }
  }
}

export const dbClient = DatabaseClientManager.getInstance();