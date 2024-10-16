import React from 'react';
import './Sidebar.css'; // Importing sidebar styles

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h3>Dashboard</h3>
            <ul>
                <li className="login-image">
                    <img
                        src={require('../Login/Logo2.png')}
                        alt="Login Illustration"
                        style={{ width: '200px', height: 'auto' }} // Set specific size
                    />
                </li>
                <li>User Management</li>
                <li>Hive Management</li>
                <li>Account Details</li>
                <li>Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;
