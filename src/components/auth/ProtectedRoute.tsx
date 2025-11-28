import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/useAuth';
import { ROUTES } from '@/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.CHOOSE_ROLE} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
