// client/src/components/AdminRoute.jsx
// Protects routes reserved exclusively for administrators (dashboard, listings management, leads).

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="w-10 h-10 border-4 border-[#C89B3C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in -> send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but not admin -> redirect to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
