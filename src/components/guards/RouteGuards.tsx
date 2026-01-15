import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

// Protects routes that require authentication
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const location = useLocation();

    if (!authService.isAuthenticated()) {
        // Redirect to login page, save the attempted URL
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

// Protects auth routes (login, etc.) - redirects to dashboard if already logged in
export const GuestRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    if (authService.isAuthenticated()) {
        // User is already logged in, redirect to dashboard
        return <Navigate to="/main/dashboard" replace />;
    }

    return <>{children}</>;
};
