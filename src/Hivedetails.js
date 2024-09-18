import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Hivedetails.css';
import HivePieChart from './HivePieChart'; 

const Hivedetails = () => {
    const [hives, setHives] = useState([]);

    useEffect(() => {
    
        axios.get('http://localhost:5000/hives-details')
            .then(response => {
                if (response.data.success) {
                    setHives(response.data.data); 
                } else {
                    console.error('Failed to fetch hive details');
                }
            })
            .catch(error => {
                console.error('Error fetching hive details', error);
            });
    }, []);

    return (
        <div className="hive-details-container">
            <h1>Hive Details</h1>
            <div className="hive-details-grid">
                {hives.length > 0 ? (
                    hives.map((hive) => (
                        <div key={hive.hiveNo} className="hive-card">
                            <h2>Hive #{hive.hiveNo}</h2>
                            <p><strong>Humidity:</strong> {hive.humidity}</p>
                            <p><strong>Temperature:</strong> {hive.temperature}</p>
                            <p><strong>Bee In/Out:</strong> {hive.beeInOut}</p>
                            <p><strong>Raindrops:</strong> {hive.raindrops}</p>
                            <p><strong>Current Date/Time:</strong> {new Date(hive.currentDateTime).toLocaleString()}</p>
                            <p><strong>Expected Harvest Date:</strong> {new Date(hive.expectedHarvestDate).toLocaleDateString()}</p>
                            <HivePieChart honeyLevel={hive.honeyLevel} />
                        </div>
                    ))
                ) : (
                    <p>No hive details available.</p>
                )}
            </div>
        </div>
    );
};

export default Hivedetails;
