import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuth();

  console.log('Role:', role);
  console.log('Required Role:', requiredRole);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const normalizedRole = role.trim().toLowerCase();

  // If user is admin and trying to access user routes, redirect to admin dashboard
  if (normalizedRole === 'admin' && !requiredRole) {
    return <Navigate to="/admin/dashboard" />;
  }

  // If requiredRole is specified, check for role match
  if (requiredRole) {
    const normalizedRequiredRole = requiredRole.trim().toLowerCase();
    
    if (normalizedRole !== normalizedRequiredRole) {
      // If user isn't admin, redirect to user dashboard
      // If admin isn't authorized for this specific route, redirect to admin dashboard
      return <Navigate to={normalizedRole === 'admin' ? "/admin/dashboard" : "/dashboard"} />;
    }
  }

  return children;
};

export default ProtectedRoute;