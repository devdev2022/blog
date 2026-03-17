import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { openLoginModal } from '@/store/modalSlice';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      dispatch(openLoginModal());
    }
  }, [isLoading, user, dispatch]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export default ProtectedRoute;
