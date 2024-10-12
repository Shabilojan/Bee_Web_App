import React from 'react';
import { Navigate } from 'react-router-dom';

// This component protects routes based on authentication and role
const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token'); // Check for JWT token in localStorage
    const userRole = localStorage.getItem('role'); // Check user role stored in localStorage

    // If there's no token, redirect to the login page
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // If the user's role doesn't match the required role, deny access
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children; // Allow access to the route
};

export default ProtectedRoute;
