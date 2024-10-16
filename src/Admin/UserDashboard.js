import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import image from './image.png'; // Importing the image

const UserDashboard = () => {
    const [hiveCount, setHiveCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetching the hive count (specific to user functionality)
        fetch('/api/dashboard-counts')
            .then(response => response.json())
            .then(data => {
                setHiveCount(data.hiveCount);
            })
            .catch(error => console.error('Error fetching hive count:', error));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the JWT token from local storage
        localStorage.removeItem('role'); // Remove the user role from local storage

        navigate('/'); // Navigate to the login page or home page
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <header className="header">
                    <h2>User Dashboard</h2>
                    <div className="profile">
                        <img src={image} alt="User" className="profile-pic" />
                        <span className="user-name">User</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </div>
                </header>

                <div className="metrics">
                    <div className="metric-card">
                        <h3>Total Hives</h3>
                        <p>{hiveCount}</p>
                    </div>
                </div>

                <div className="card-container">
                    <div className="card">
                        <h3>Hive Management</h3>
                        <button onClick={() => navigate('/hive-details')}>View Hive Details</button>
                    </div>
                    <div className="card">
                        <h3>Hive Checker</h3>
                        <button onClick={() => navigate('/hive')}>View specific Hive</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
