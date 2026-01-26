import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="h-screen flex items-center justify-center font-black text-[#0A7FC7] text-2xl animate-pulse tracking-tighter">UDATA</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};
