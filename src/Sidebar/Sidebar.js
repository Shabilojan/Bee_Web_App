import React, { useState } from 'react';
import './Sidebar.css'; // Importing sidebar styles

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close' : 'Open'}
      </button>
      <h3>Dashboard</h3>
      <ul>
        
          <img className="login-image"
            src={require('../Login/Logo2.png')}
            alt="Login Illustration"
            style={{ width: '200px', height: 'auto' }}
          />
      
        <li>User Management</li>
        <li>Hive Management</li>
        <li>Account Details</li>
        <li>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;