import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, openLoginModal } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      openLoginModal();
    }
  }, [isLoading, user, openLoginModal]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default ProtectedRoute;
