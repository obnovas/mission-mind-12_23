import React from 'react';
import { supabase } from '../supabase';
import { cleanupOldData } from '../../utils/cleanup/dataCleanup';

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [isInitializing, setIsInitializing] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Test connection
        const { error: connectionError } = await supabase
          .from('user_settings')
          .select('count')
          .limit(1);

        if (connectionError) throw connectionError;

        // Run cleanup tasks in background
        cleanupOldData().catch(console.error);
      } catch (err) {
        console.error('Failed to initialize database:', err);
        setError(err instanceof Error ? err : new Error('Failed to connect to database'));
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDatabase();
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md w-full mx-4 p-6 bg-white rounded-lg shadow-lg border border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Connection Error</h2>
          <p className="text-neutral-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}