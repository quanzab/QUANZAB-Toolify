import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  toolName: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, toolName }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to. This allows us to send them back after they sign in.
    return <Navigate to="/signin" state={{ from: location, toolName }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;