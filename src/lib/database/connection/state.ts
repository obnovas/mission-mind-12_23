import { ConnectionState } from './types';

const initialState: ConnectionState = {
  isConnected: false,
  error: null,
  lastAttempt: null,
  retryCount: 0,
};

class ConnectionStateManager {
  private static instance: ConnectionStateManager;
  private state: ConnectionState = { ...initialState };
  private listeners: Set<(state: ConnectionState) => void> = new Set();

  private constructor() {}

  public static getInstance(): ConnectionStateManager {
    if (!ConnectionStateManager.instance) {
      ConnectionStateManager.instance = new ConnectionStateManager();
    }
    return ConnectionStateManager.instance;
  }

  public getState(): ConnectionState {
    return { ...this.state };
  }

  public setState(updates: Partial<ConnectionState>): void {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  public reset(): void {
    this.state = { ...initialState };
    this.notifyListeners();
  }

  public subscribe(listener: (state: ConnectionState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const connectionState = ConnectionStateManager.getInstance();