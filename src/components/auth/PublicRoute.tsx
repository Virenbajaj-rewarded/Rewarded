import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/services/auth/useAuth';
import { ROUTES } from '@/routes';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
