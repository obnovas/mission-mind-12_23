import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DatabaseProvider } from './lib/database/provider';
import { LoadingProvider } from './components/common/LoadingProvider';
import { AppRoutes } from './routes';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { updatePastScheduledCheckIns } from './utils/checkIn/statusUpdate';

export function App() {
  const setUser = useAuthStore((state) => state.setUser);

  React.useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Update check-ins in background
        setTimeout(() => {
          updatePastScheduledCheckIns().catch(console.error);
        }, 1000);
      }
    });

    // Listen for changes in auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Update check-ins in background
        setTimeout(() => {
          updatePastScheduledCheckIns().catch(console.error);
        }, 1000);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <DatabaseProvider>
      <DndProvider backend={HTML5Backend}>
        <LoadingProvider>
          <Router>
            <AppRoutes />
          </Router>
        </LoadingProvider>
      </DndProvider>
    </DatabaseProvider>
  );
}