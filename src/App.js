import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './Admin/AdminDashboard'; // Admin Dashboard
import User from './User/User'; // User Dashboard
import Login from './Login/Login'; // Login Page
import Hive from './Hive/Hive'; // Hive component

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Admin" element={<AdminDashboard />} />
                <Route path="/user" element={<User />} />
                <Route path="/Hive" element={<Hive />} />
            </Routes>
        </Router>
    );
};

export default App;
