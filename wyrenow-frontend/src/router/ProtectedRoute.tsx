// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAppSelector } from '../hooks/redux';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
 const {token,isAuthenticated} = useAppSelector((state) => state.auth);

  return isAuthenticated && token ? children : <Navigate to="/login" replace />;
}
