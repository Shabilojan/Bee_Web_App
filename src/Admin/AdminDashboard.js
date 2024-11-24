import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './Dashboard.css';
import profilePic from './image.png'; // Importing the image

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(0);
    const [hiveCount, setHiveCount] = useState(0);
    const [accountDetails, setAccountDetails] = useState(null);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch hive count
                const hiveResponse = await fetch('http://localhost:5000/hive-count');
                const hiveData = await hiveResponse.json();
                setHiveCount(hiveData.count);

                // Fetch user count
                const userResponse = await fetch('http://localhost:5000/user-count');
                const userData = await userResponse.json();
                setUserCount(userData.count);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error, e.g., display an error message to the user
            }
        };

        fetchData();
    }, []);

    
    useEffect(() => {
        const fetchAccountDetails = async () => {
            const token = localStorage.getItem('token'); 

            try {
                const response = await fetch('http://localhost:5000/account-details', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setAccountDetails(data.data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to fetch account details.');
            }
        };

        fetchAccountDetails();
    }, []);

    if (error) return <p>{error}</p>;
    if (!accountDetails) return <p>Loading...</p>;

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
                    <h2>Admin Dashboard</h2>
                    <div className="profile">
                        <img
                            src={accountDetails.profilePicture || 'default-profile.png'} // Dynamic profile picture
                            alt="Profile"
                            className="profile-pic"
                        />
                        <span className="admin-name">{accountDetails.name}</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </div>
                </header>

                <div className="metrics">
                    <div className="metric-card">
                        <h3>Total Hives</h3>
                        <p>{hiveCount}</p> {/* Displaying hive count */}
                    </div>
                    <div className="metric-card">
                        <h3>Total Users</h3>
                        <p>{userCount}</p> {/* Displaying user count */}
                    </div>
                </div>

                <div className="card-container">
                    <div className="card">
                        <h3>User Management</h3>
                        <button onClick={() => navigate('/user-details')}>Manage Users</button>
                    </div>

                    <div className="card">
                        <h3>Hive Management</h3>
                        <button onClick={() => navigate('/hive')}>Manage Hives</button>
                    </div>

                    <div className="card">
                        <h3>Hive Details</h3>
                        <button onClick={() => navigate('/hive-details')}>View Hive Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
