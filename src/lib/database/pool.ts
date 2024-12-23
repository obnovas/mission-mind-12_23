import { SupabaseClient } from '@supabase/supabase-js';
import { getEnvConfig } from '../../config/env';

interface PoolConfig {
  maxSize: number;
  minSize: number;
  acquireTimeout: number;
}

export class ConnectionPool {
  private pool: SupabaseClient[] = [];
  private inUse: Set<SupabaseClient> = new Set();
  private config: PoolConfig;

  constructor(config: PoolConfig) {
    this.config = config;
    this.initialize();
  }

  private async initialize() {
    const config = getEnvConfig();
    
    // Create minimum connections
    for (let i = 0; i < this.config.minSize; i++) {
      const client = new SupabaseClient(config.supabaseUrl, config.supabaseAnonKey);
      this.pool.push(client);
    }
  }

  public async acquire(): Promise<SupabaseClient> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Connection acquisition timeout')), this.config.acquireTimeout);
    });

    try {
      return await Promise.race([
        this.getConnection(),
        timeoutPromise
      ]);
    } catch (err) {
      throw new Error(`Failed to acquire connection: ${err.message}`);
    }
  }

  private async getConnection(): Promise<SupabaseClient> {
    // Check for available connection in pool
    const connection = this.pool.find(conn => !this.inUse.has(conn));
    
    if (connection) {
      this.inUse.add(connection);
      return connection;
    }

    // Create new connection if pool isn't at max size
    if (this.pool.length < this.config.maxSize) {
      const config = getEnvConfig();
      const newConnection = new SupabaseClient(config.supabaseUrl, config.supabaseAnonKey);
      this.pool.push(newConnection);
      this.inUse.add(newConnection);
      return newConnection;
    }

    // Wait for a connection to become available
    return new Promise((resolve) => {
      const checkPool = setInterval(() => {
        const availableConnection = this.pool.find(conn => !this.inUse.has(conn));
        if (availableConnection) {
          clearInterval(checkPool);
          this.inUse.add(availableConnection);
          resolve(availableConnection);
        }
      }, 100);
    });
  }

  public async release(connection: SupabaseClient): Promise<void> {
    this.inUse.delete(connection);
  }

  public async drain(): Promise<void> {
    // Wait for all connections to be released
    while (this.inUse.size > 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Clear the pool
    this.pool = [];
    this.inUse.clear();
  }
}