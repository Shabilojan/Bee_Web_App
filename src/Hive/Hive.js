import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hive.css';
import './Hivedetails.css';
import HivePieChart from './HivePieChart';

const Hive = () => {
    const [hive, setHive] = useState(null);
    const [hiveNo, setHiveNo] = useState('');
    const [searched, setSearched] = useState(false);
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});
    const [isCreating, setIsCreating] = useState(false);
    const [newHive, setNewHive] = useState({
        hiveNo: '',
        humidity: '',
        temperature: '',
        beeInOut: '',
        raindrops: '',
        expectedHarvestDate: '',
        honeyLevel: '',
    });

    // Check user role from local storage
    const userRole = localStorage.getItem('role'); // Fetch the role from localStorage

    // Fetch hive details
    const fetchHiveDetails = () => {
        axios.get(`http://localhost:5000/hive-details?hiveNo=${hiveNo}`)
            .then(response => {
                if (response.data.success) {
                    setHive(response.data.data);
                    setEditData(response.data.data);
                    setMessage('');
                } else {
                    setHive(null);
                    setMessage('No hive details found.');
                }
            })
            .catch(error => {
                setHive(null);
                setMessage('Error fetching hive details');
            });
    };

    const handleSearch = () => {
        if (hiveNo) {
            setSearched(true);
            fetchHiveDetails();
        }
    };

    const handleClear = () => {
        setHive(null);
        setHiveNo('');
        setSearched(false);
        setMessage('');
        setIsEditing(false);
        setIsCreating(false);
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete Hive #${hiveNo}?`)) {
            axios.delete(`http://localhost:5000/hive-details?hiveNo=${hiveNo}`)
                .then(() => {
                    setMessage(`Hive #${hiveNo} has been deleted.`);
                    setHive(null);
                    setSearched(false);
                    setHiveNo('');
                    setIsEditing(false);
                })
                .catch(error => {
                    console.error('Failed to delete hive:', error);
                    setMessage('Failed to delete hive.');
                });
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:5000/hive-details`, editData)
            .then(() => {
                setMessage(`Hive #${editData.hiveNo} has been updated.`);
                setIsEditing(false);
                fetchHiveDetails();
            })
            .catch(error => {
                console.error('Failed to update hive:', error);
                setMessage('Failed to update hive.');
            });
    };

    const handleCreateToggle = () => {
        setIsCreating(!isCreating);
        setNewHive({
            hiveNo: '',
            humidity: '',
            temperature: '',
            beeInOut: '',
            raindrops: '',
            expectedHarvestDate: '',
            honeyLevel: '',
        });
    };

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setNewHive(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCreate = () => {
        axios.post('http://localhost:5000/hive-details', newHive)
            .then(() => {
                setMessage(`Hive #${newHive.hiveNo} has been created.`);
                setIsCreating(false);
                setHive(null);
                setHiveNo('');
            })
            .catch(() => {
                setMessage('Failed to create hive.');
            });
    };

    return (
        <div className="hive-details-container">
            <h1>Hive Details</h1>

            <div className="search-bar">
                <input
                    type="number"
                    placeholder="Enter Hive Number"
                    value={hiveNo}
                    onChange={(e) => setHiveNo(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleClear} style={{ marginLeft: '10px' }}>Clear</button>
                {userRole === 'Admin' && (
                    <button onClick={handleCreateToggle} style={{ marginLeft: '10px' }}>
                        {isCreating ? 'Cancel' : 'Create Hive'}
                    </button>
                )}
            </div>

            {message && <p>{message}</p>}

            {searched && hive && !isEditing && (
                <div className="hive-card">
                    <h2>Hive #{hive.hiveNo}</h2>
                    <p><strong>Humidity:</strong> {hive.humidity}</p>
                    <p><strong>Temperature:</strong> {hive.temperature}</p>
                    <p><strong>Bee In/Out:</strong> {hive.beeInOut}</p>
                    <p><strong>Raindrops:</strong> {hive.raindrops}</p>
                    <p><strong>Expected Harvest Date:</strong> {new Date(hive.expectedHarvestDate).toLocaleDateString()}</p>
                    <p><strong>Honey Level:</strong> {hive.honeyLevel}</p>
                    <HivePieChart honeyLevel={hive.honeyLevel} />

                    {userRole === 'Admin' && (
                        <>
                            <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete Hive</button>
                            <button onClick={handleEditToggle} style={{ marginLeft: '10px' }}>Edit Hive</button>
                        </>
                    )}
                </div>
            )}

            {searched && isEditing && (
                <div className="hive-card">
                    <h2>Edit Hive #{hive.hiveNo}</h2>
                    <form>
                        <div>
                            <label>Humidity: </label>
                            <input
                                type="number"
                                name="humidity"
                                value={editData.humidity}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div>
                            <label>Temperature: </label>
                            <input
                                type="number"
                                name="temperature"
                                value={editData.temperature}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div>
                            <label>Bee In/Out: </label>
                            <input
                                type="text"
                                name="beeInOut"
                                value={editData.beeInOut}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div>
                            <label>Raindrops: </label>
                            <input
                                type="number"
                                name="raindrops"
                                value={editData.raindrops}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div>
                            <label>Expected Harvest Date: </label>
                            <input
                                type="date"
                                name="expectedHarvestDate"
                                value={editData.expectedHarvestDate}
                                onChange={handleEditInputChange}
                            />
                        </div>
                        <div>
                            <label>Honey Level: </label>
                            <input
                                type="text"
                                name="honeyLevel"
                                value={editData.honeyLevel}
                                onChange={handleEditInputChange}
                            />
                        </div>

                        <button type="button" onClick={handleUpdate} style={{ marginTop: '10px' }}>Save Changes</button>
                        <button type="button" onClick={handleEditToggle} style={{ marginLeft: '10px' }}>Cancel</button>
                    </form>
                </div>
            )}

            {isCreating && userRole === 'Admin' && (
                <div className="hive-card">
                    <h2>Create New Hive</h2>
                    <form>
                        <div>
                            <label>Hive Number: </label>
                            <input
                                type="number"
                                name="hiveNo"
                                value={newHive.hiveNo}
                                onChange={handleCreateInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Humidity: </label>
                            <input
                                type="number"
                                name="humidity"
                                value={newHive.humidity}
                                onChange={handleCreateInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Temperature: </label>
                            <input
                                type="number"
                                name="temperature"
                                value={newHive.temperature}
                                onChange={handleCreateInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Bee In/Out: </label>
                            <input
                                type="text"
                                name="beeInOut"
                                value={newHive.beeInOut}
                                onChange={handleCreateInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Raindrops: </label>
                            <input
                                type="number"
                                name="raindrops"
                                value={newHive.raindrops}
                                onChange={handleCreateInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Expected Harvest Date: </label>
                            <input
                                type="date"
                                name="expectedHarvestDate"
                                value={newHive.expectedHarvestDate}
                                onChange={handleCreateInputChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Honey Level: </label>
                            <input
                                type="text"
                                name="honeyLevel"
                                value={newHive.honeyLevel}
                                onChange={handleCreateInputChange}
                                required
                            />
                        </div>

                        <button type="button" onClick={handleCreate} style={{ marginTop: '10px' }}>Create Hive</button>
                        <button type="button" onClick={handleCreateToggle} style={{ marginLeft: '10px' }}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Hive;
