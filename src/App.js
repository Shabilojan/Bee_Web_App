import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import User from './User/User';
import Login from './Login/Login';
import Hive from './Hive/Hive';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public route for login */}
                <Route path="/" element={<Login />} />

                {/* Protected route for Admin - requires Admin role */}
                <Route
                    path="/Admin"
                    element={
                        <ProtectedRoute requiredRole="Admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Protected route for User - requires user role */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute requiredRole="user">
                            <User />
                        </ProtectedRoute>
                    }
                />

                {/* Protected route for Hive - accessible to all authenticated users */}
                <Route
                    path="/Hive"
                    element={
                        <ProtectedRoute>
                            <Hive />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
