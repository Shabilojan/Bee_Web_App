import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Sidebar from './Sidebar'; // Sidebar component
import './Dashboard.css'; // Importing styles

const AdminDashboard = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <header className="header">
                    <h2>Admin Dashboard</h2>
                    <div className="profile">
                        <img src="./logo.png" alt="Admin" className="profile-pic" />
                        <span className="admin-name">Admin</span>
                    </div>
                </header>

                <div className="metrics">
                    <div className="metric-card">
                        <h3>Total Users</h3>
                        <p>100</p> {/* Placeholder for user count */}
                    </div>
                    <div className="metric-card">
                        <h3>Total Hives</h3>
                        <p>50</p> {/* Placeholder for hive count */}
                    </div>
                </div>

                <div className="card-container">
                    <div className="card">
                        <h3>User Management</h3>
                        <button onClick={() => navigate('/user-management')}>Manage Users</button>
                    </div>

                    <div className="card">
                        <h3>Hive Management</h3>
                        <button onClick={() => navigate('/hive-management')}>Manage Hives</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
