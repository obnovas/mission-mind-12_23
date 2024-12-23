export interface ConnectionConfig {
  maxRetries: number;
  retryDelay: number;
  timeout: number;
}

export interface ConnectionState {
  isConnected: boolean;
  error: Error | null;
  lastAttempt: Date | null;
  retryCount: number;
}

export interface ConnectionManager {
  initialize(): Promise<void>;
  getClient(): any;
  disconnect(): Promise<void>;
}