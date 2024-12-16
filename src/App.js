import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard';
import UserDashboard from './Admin/UserDashboard';
import User from './User/User';
import Login from './Login/Login';
import Hive from './Hive/Hive';
import Hivedetails from './Hive/Hivedetails';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import AccountDetailsScreen from './Admin/AccountDetailsScreen';
import BeeFarming from './Admin/BeeFarming';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route for login */}
        <Route path="/" element={<Login />} />

        {/* Protected routes with error handling and role-based redirection */}
        <Route
          path="/Admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
          // Add error handling for unauthorized access or unexpected roles
          onError={(error) => {
            console.error('Error in protected route:', error);
            // Redirect to login or display an error message based on the error type
            if (error.status === 401) { // Handle unauthorized access
              alert('Unauthorized access. Please log in or contact support.');
              // Consider redirecting to login here
            } else {
              // Handle other errors (e.g., unexpected roles)
              alert('An error occurred. Please try again later.');
            }
          }}
        />
        
        
        <Route
          path="/User"
          element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          }

        />

        <Route
          path="/Hive"
          element={
            <ProtectedRoute>
              <Hive />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Hive-details"
          element={
            <ProtectedRoute>
              <Hivedetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-details"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />

<Route
          path="/account-details"
          element={
            <ProtectedRoute>
              <AccountDetailsScreen/>
            </ProtectedRoute>
          }
        />


<Route
          path="/BeeFarming"
          element={
            <ProtectedRoute>
              <BeeFarming/>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;