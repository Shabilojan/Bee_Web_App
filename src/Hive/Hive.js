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
    const [isCreating, setIsCreating] = useState(false); // New state for create mode
    const [newHive, setNewHive] = useState({
        hiveNo: '',
        humidity: '',
        temperature: '',
        beeInOut: '',
        raindrops: '',
        expectedHarvestDate: '',
    }); // New hive data

    // Fetch hive details
    const fetchHiveDetails = () => {
        let url = `http://localhost:5000/hive-details?hiveNo=${hiveNo}`;

        axios.get(url)
            .then(response => {
                if (response.data.success) {
                    setHive(response.data.data);
                    setEditData(response.data.data); // Populate the edit form with existing data
                } else {
                    setHive(null);
                    setMessage('No hive details found');
                }
            })
            .catch(error => {
                setHive(null);
                console.error('Error fetching hive details', error);
            });
    };

    const handleInputChange = (event) => {
        setHiveNo(event.target.value);
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
    };

    const handleDelete = () => {
        axios.delete(`http://localhost:5000/hive-details/${hiveNo}`)
            .then(() => {
                setHive(null); 
                setMessage(`Hive #${hiveNo} has been deleted.`);
                setSearched(false);
            })
            .catch(error => {
                console.error('Error deleting hive', error);
                setMessage('Failed to delete hive.');
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
        axios.put(`http://localhost:5000/hive-details/${hiveNo}`, editData)
            .then(() => {
                setMessage(`Hive #${hiveNo} has been updated.`);
                fetchHiveDetails(); // Refresh data after update
                setIsEditing(false); // Exit edit mode
            })
            .catch(error => {
                console.error('Error updating hive', error);
                setMessage('Failed to update hive.');
            });
    };

    // Create Hive handlers
    const handleCreateToggle = () => {
        setIsCreating(!isCreating);
        setNewHive({
            hiveNo: '',
            humidity: '',
            temperature: '',
            beeInOut: '',
            raindrops: '',
            expectedHarvestDate: '',
        });
    };

    const handleCreateInputChange = (e) => {
        const { name, value } = e.target;
        setNewHive({ ...newHive, [name]: value });
    };

    const handleCreate = () => {
        console.log('Creating hive with data:', newHive); // Log the data being sent
        axios.post(`http://localhost:5000/hive-details`, newHive)

            .then(() => {
                setMessage(`Hive #${newHive.hiveNo} has been created.`);
                setIsCreating(false);
                setHive(null);
                setHiveNo('');
            })
            .catch(error => {
                console.error('Error creating hive', error);
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
                    onChange={handleInputChange}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleClear} style={{ marginLeft: '10px' }}>Clear</button>
                <button onClick={handleCreateToggle} style={{ marginLeft: '10px' }}>Create Hive</button>
            </div>

            {message && <p>{message}</p>} 

            {searched && hive && !isEditing && (
                <div className="hive-card">
                    <h2>Hive #{hive.hiveNo}</h2>
                    <p><strong>Humidity:</strong> {hive.humidity}</p>
                    <p><strong>Temperature:</strong> {hive.temperature}</p>
                    <p><strong>Bee In/Out:</strong> {hive.beeInOut}</p>
                    <p><strong>Raindrops:</strong> {hive.raindrops}</p>
                    <p><strong>Current Date/Time:</strong> {new Date(hive.currentDateTime).toLocaleString()}</p>
                    <p><strong>Expected Harvest Date:</strong> {new Date(hive.expectedHarvestDate).toLocaleDateString()}</p>
                    <HivePieChart honeyLevel={hive.honeyLevel} />
                    
                    <button onClick={handleDelete} style={{ marginTop: '10px' }}>Delete Hive</button>
                    <button onClick={handleEditToggle} style={{ marginLeft: '10px' }}>Edit Hive</button>
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

                        <button type="button" onClick={handleUpdate} style={{ marginTop: '10px' }}>Save Changes</button>
                        <button type="button" onClick={handleEditToggle} style={{ marginLeft: '10px' }}>Cancel</button>
                    </form>
                </div>
            )}

            {isCreating && (
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
                            />
                        </div>
                        <div>
                            <label>Humidity: </label>
                            <input
                                type="number"
                                name="humidity"
                                value={newHive.humidity}
                                onChange={handleCreateInputChange}
                            />
                        </div>
                        <div>
                            <label>Temperature: </label>
                            <input
                                type="number"
                                name="temperature"
                                value={newHive.temperature}
                                onChange={handleCreateInputChange}
                            />
                        </div>
                        <div>
                            <label>Bee In/Out: </label>
                            <input
                                type="text"
                                name="beeInOut"
                                value={newHive.beeInOut}
                                onChange={handleCreateInputChange}
                            />
                        </div>
                        <div>
                            <label>Raindrops: </label>
                            <input
                                type="number"
                                name="raindrops"
                                value={newHive.raindrops}
                                onChange={handleCreateInputChange}
                            />
                        </div>
                        <div>
                            <label>Expected Harvest Date: </label>
                            <input
                                type="date"
                                name="expectedHarvestDate"
                                value={newHive.expectedHarvestDate}
                                onChange={handleCreateInputChange}
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