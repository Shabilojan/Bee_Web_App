import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';

const AccountDetailsScreen = () => {
    const navigate = useNavigate();
    const [accountDetails, setAccountDetails] = useState(null);
    const [error, setError] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('role');
        navigate('/'); 
    };

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

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <header className="header">
                    <h2>Account Details</h2>
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
                <div>
                    <p><strong>ID:</strong> {accountDetails.id}</p>
                    <p><strong>Name:</strong> {accountDetails.name}</p>
                    <p><strong>Email:</strong> {accountDetails.email}</p>
                    <p><strong>Role:</strong> {accountDetails.role}</p>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailsScreen;
