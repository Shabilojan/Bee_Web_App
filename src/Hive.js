import React, { useState } from 'react';
import axios from 'axios';
import './Hive.css';
import './Hivedetails.css';
import HivePieChart from './HivePieChart';

const Hive = () => {
    const [hive, setHive] = useState(null); // Store a single hive's data
    const [hiveNo, setHiveNo] = useState('');
    const [searched, setSearched] = useState(false); // To track if a search has been performed

    const fetchHiveDetails = () => {
        let url = `http://localhost:5000/hive-details?hiveNo=${hiveNo}`;

        axios.get(url)
            .then(response => {
                if (response.data.success) {
                    setHive(response.data.data[hiveNo]); // Set the first matching hive
                } else {
                    console.error('Failed to fetch hive details');
                }
            })
            .catch(error => {
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
            </div>

            {searched && hive && (
                <div className="hive-card">
                    <h2>Hive #{hive.hiveNo}</h2>
                    <p><strong>Humidity:</strong> {hive.humidity}</p>
                    <p><strong>Temperature:</strong> {hive.temperature}</p>
                    <p><strong>Bee In/Out:</strong> {hive.beeInOut}</p>
                    <p><strong>Raindrops:</strong> {hive.raindrops}</p>
                    <p><strong>Current Date/Time:</strong> {new Date(hive.currentDateTime).toLocaleString()}</p>
                    <p><strong>Expected Harvest Date:</strong> {new Date(hive.expectedHarvestDate).toLocaleDateString()}</p>
                    <HivePieChart honeyLevel={hive.honeyLevel} />
                </div>
            )}

            {searched && !hive && (
                <p>No hive details found for hive number {hiveNo}.</p>
            )}
        </div>
    );
};

export default Hive;
