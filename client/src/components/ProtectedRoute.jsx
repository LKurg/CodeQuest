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

  // If requiredRole is undefined, allow access for all authenticated users
  if (requiredRole === undefined) {
    return children;
  }

  const normalizedRole = role.trim().toLowerCase();
  const normalizedRequiredRole = requiredRole.trim().toLowerCase();

  // If the required role is 'user'
  if (normalizedRequiredRole === 'user') {
    // Allow both users and admins, but redirect admin to admin dashboard
    if (normalizedRole === 'admin') {
      return <Navigate to="/admin/create-tutorial" />;
    }
    return children;
  }

  // For admin-specific routes
  if (normalizedRequiredRole === 'admin') {
    if (normalizedRole !== 'admin') {
      return <Navigate to="/dashboard" />;
    }
    return children;
  }

  // For any other role-specific routes
  if (normalizedRole !== normalizedRequiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;