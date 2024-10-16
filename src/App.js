import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import User from './User/User';
import Login from './Login/Login';
import UserDashboard from './Admin/UserDashboard';
import Hive from './Hive/Hive';
import Hivedetails from './Hive/Hivedetails'
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
                            <UserDashboard />
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

                {/* Protected route for Hive - accessible to all authenticated users */}
                <Route
                    path="/Hive-details"
                    element={
                        <ProtectedRoute>
                            <Hivedetails/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/user-details"
                    element={
                        <ProtectedRoute>
                            <User/>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
