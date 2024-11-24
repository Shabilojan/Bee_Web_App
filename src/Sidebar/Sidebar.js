import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css'; // Importing sidebar styles
import '../Admin/AccountDetailsScreen';
const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all local storage items
    navigate('/'); // Navigate to the login page or home page
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
        <li><Link to="/User">User Management</Link></li>
        <li><Link to="/hive">Hive Management</Link></li>
        <li><Link to="/account-details">Account Details</Link></li>
        <li><button onClick={handleLogout} className="logout-link">Logout</button></li>
      </ul>
    </div>
  );
};

export default Sidebar;
