import React from 'react';
import './Sidebar.css'; // Importing sidebar styles

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h3>Dashboard</h3>
            <ul>
                <li>User Management</li>
                <li>Hive Management</li>
                <li>Account Details</li>
            </ul>
        </div>
    );
};

export default Sidebar;
