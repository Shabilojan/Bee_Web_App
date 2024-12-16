import React, { useState } from 'react';
import axios from 'axios';
import './User.css';
import Sidebar from '../Sidebar/Sidebar';
import profilePic from '../Admin/image.png'; 
import { useNavigate } from 'react-router-dom';

const User = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState('');
    const [searched, setSearched] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isCreating, setIsCreating] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        profilePicture: '',
        username: '',
        password: '',
        role: ''
    });

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the JWT token from local storage
        localStorage.removeItem('role'); // Remove the user role from local storage
        navigate('/'); // Navigate to the login page or home page
    };

    // Fetch user details
    const fetchUserDetails = () => {
        if (!userId) {
            setMessage('Please enter a user ID.');
            return;
        }

        const url = `http://localhost:5000/user-details/${userId}`;

        axios.get(url)
            .then(response => {
                if (response.data.success) {
                    setUser(response.data.data);
                    setEditData(response.data.data);
                    setMessage('');
                } else {
                    setUser(null);
                    setMessage(response.data.message || 'No user details found');
                }
            })
            .catch(error => {
                setUser(null);
                console.error('Error fetching user details:', error.response ? error.response.data : error.message);
                setMessage('Error fetching user details. Please try again.');
            });
    };

    const handleInputChange = (event) => {
        setUserId(event.target.value);
    };

    const handleSearch = () => {
        if (!userId) {
            setMessage('Please enter a user ID.');
        } else {
            setSearched(true);
            fetchUserDetails();
        }
    };

    const handleClear = () => {
        setUser(null);
        setUserId('');
        setSearched(false);
        setMessage('');
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:5000/user-details/${userId}`)
            .then(() => {
                setUser(null);
                setMessage(`User #${userId} has been deleted.`);
                setSearched(false);
                setUserId(''); // Clear userId after deletion
            })
            .catch(error => {
                console.error('Error deleting user', error);
                setMessage('Failed to delete user.');
            });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:5000/user-details/${userId}`, editData)
            .then(() => {
                setMessage(`User #${userId} has been updated.`);
                fetchUserDetails(); // Refresh data after update
                setIsEditing(false); // Exit edit mode
            })
            .catch(error => {
                console.error('Error updating user', error);
                setMessage('Failed to update user.');
            });
    };

    // Create User handlers
    const handleCreateToggle = () => {
        setIsCreating(!isCreating);
        setNewUser({
            name: '',
            email: '',
            phoneNumber: '',
            profilePicture: '',
            username: '',
            password: '',
            role: ''
        });
    };

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleCreate = () => {
        // Validation
        if (!newUser.name || !newUser.email || !newUser.phoneNumber || !newUser.username || !newUser.password || !newUser.role) {
            setMessage('Please fill in all fields.');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(newUser.email)) {
            setMessage('Please enter a valid email address.');
            return;
        }

        if (!/^\d{10}$/.test(newUser.phoneNumber)) {
            setMessage('Phone number should be exactly 10 digits.');
            return;
        }

        axios.post(`http://localhost:5000/user-details`, newUser)
            .then(() => {
                setMessage(`User #${newUser.name} has been created.`);
                setIsCreating(false);
                setUser(null);
                setUserId('');
            })
            .catch(error => {
                console.error('Error creating user', error);
                setMessage('Failed to create user.');
            });
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <header className="header">
                    <h2>User Management</h2>
                    <div className="profile">
                        <img src={profilePic} alt="Admin" className="profile-pic" />
                        <span className="admin-name">Admin</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </div>
                </header>
                <div className="user-details-container">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Enter Username"
                            value={userId}
                            onChange={handleInputChange}
                        />
                        <button onClick={handleSearch}>Search</button>
                        <button onClick={handleClear} style={{ marginLeft: '10px' }}>Clear</button>
                        <button onClick={handleCreateToggle} style={{ marginLeft: '10px' }}>Create User</button>
                    </div>

                    {message && <p>{message}</p>}

                    {searched && user && !isEditing && (
                        <div className="user-card">
                            <h2>User ID: {user.id}</h2>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
                            <p><strong>Profile Picture:</strong> <img src={user.profilePicture} alt="Profile" width="100" /></p>

                            <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete User</button>
                            <button onClick={handleEditToggle} style={{ marginLeft: '10px' }}>Edit User</button>
                        </div>
                    )}

                    {searched && isEditing && (
                        <div className="user-card">
                            <h2>Edit User ID: {user.id}</h2>
                            <form>
                                <div>
                                    <label>Name: </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Email: </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editData.email}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Phone Number: </label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={editData.phoneNumber}
                                        onChange={handleEditInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Profile Picture URL: </label>
                                    <input
                                        type="text"
                                        name="profilePicture"
                                        value={editData.profilePicture}
                                        onChange={handleEditInputChange}
                                    />
                                </div>

                                <button type="button" onClick={handleUpdate} style={{ marginTop: '10px' }}>Save Changes</button>
                                <button type="button" onClick={handleEditToggle} style={{ marginLeft: '10px' }}>Cancel</button>
                            </form>
                        </div>
                    )}

                    {isCreating && (
                        <div className="user-card">
                            <h2>Create New User</h2>
                            <form>
                                <div>
                                    <label>Name: </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newUser.name}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Email: </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Phone Number: </label>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={newUser.phoneNumber}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Profile Picture URL: </label>
                                    <input
                                        type="text"
                                        name="profilePicture"
                                        value={newUser.profilePicture}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Username: </label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={newUser.username}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Password: </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Role: </label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={newUser.role}
                                        onChange={handleCreateInputChange}
                                    />
                                </div>

                                <button type="button" onClick={handleCreate} style={{ marginTop: '10px' }}>Create User</button>
                                <button type="button" onClick={handleCreateToggle} style={{ marginLeft: '10px' }}>Cancel</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default User;
