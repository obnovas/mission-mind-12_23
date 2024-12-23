import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../../hooks/useSession';
import { sessionManager } from '../../lib/auth/session/manager';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation();
  const { session, loading, isValid } = useSession();

  React.useEffect(() => {
    // Refresh session if it exists but is invalid
    if (session && !isValid) {
      sessionManager.refreshSession().catch(console.error);
    }
  }, [session, isValid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (!session || !isValid) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}