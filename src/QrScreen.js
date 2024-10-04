import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QrScreen.css';
import './Hivedetails.css';

const QRScreen = () => {
  const [hiveNo, setHiveNo] = useState('');
  const [humidity, setHumidity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [beeInOut, setBeeInOut] = useState('');
  const [raindrops, setRaindrops] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [ExpectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [honeylevel, setHoneyLevel] = useState('');
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get');
      setRecords(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addRecord = async () => {
    try {
      const response = await axios.post('http://localhost:5000/add', {
        humidity,
        temperature,
        beeInOut,
        raindrops,
        currentDateTime,
        ExpectedHarvestDate,
        honeylevel,
      });
      fetchRecords();
      clearForm();
    } catch (error) {
      console.error(error);
    }
  };

  const updateRecord = async (hiveNo) => {
    try {
      const response = await axios.put(`http://localhost:5000/update/${hiveNo}`, {
        humidity,
        temperature,
        beeInOut,
        raindrops,
        currentDateTime,
        ExpectedHarvestDate,
        honeylevel,
      });
      fetchRecords();
      clearForm();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRecord = async (hiveNo) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${hiveNo}`);
      fetchRecords();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    const foundRecord = records.find((record) => record.hiveNo === hiveNo);
    if (foundRecord) {
      setSelectedRecord(foundRecord);
      setHumidity(foundRecord.humidity.toString());
      setTemperature(foundRecord.temperature.toString());
      setBeeInOut(foundRecord.beeInOut.toString());
      setRaindrops(foundRecord.raindrops.toString());
      setCurrentDateTime(foundRecord.currentDateTime);
      setExpectedHarvestDate(foundRecord.ExpectedHarvestDate);
      setHoneyLevel(foundRecord.honeylevel.toString());
    } else {
      alert('Hive not found');
    }
  };

  const handleSubmit = () => {
    if (selectedRecord) {
      updateRecord(selectedRecord.hiveNo);
    } else {
      addRecord();
    }
  };

  const clearForm = () => {
    setHiveNo('');
    setHumidity('');
    setTemperature('');
    setBeeInOut('');
    setRaindrops('');
    setCurrentDateTime('');
    setExpectedHarvestDate('');
    setHoneyLevel('');
    setSelectedRecord(null);
  };

  const handleRead = () => {
    fetchRecords();
  };

  return (
    <div style={styles.container}>
      <h2>Hive Management</h2>
      
      {/* Search Section */}
      <div style={styles.searchContainer}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Hive No to Search"
          value={hiveNo}
          onChange={(e) => setHiveNo(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Form Section */}
      <input
        style={styles.input}
        type="text"
        placeholder="Humidity"
        value={humidity}
        onChange={(e) => setHumidity(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Temperature"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Bee In/Out"
        value={beeInOut}
        onChange={(e) => setBeeInOut(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Raindrops"
        value={raindrops}
        onChange={(e) => setRaindrops(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Current Date Time"
        value={currentDateTime}
        onChange={(e) => setCurrentDateTime(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Expected Harvest Date"
        value={ExpectedHarvestDate}
        onChange={(e) => setExpectedHarvestDate(e.target.value)}
      />
      <input
        style={styles.input}
        type="text"
        placeholder="Honey Level"
        value={honeylevel}
        onChange={(e) => setHoneyLevel(e.target.value)}
      />

      <div style={styles.buttonContainer}>
        <button onClick={handleSubmit}>{selectedRecord ? 'Update Hive' : 'Add Hive'}</button>
        <button onClick={handleRead}>Read All Hives</button>
        {selectedRecord && (
          <>
            <button onClick={() => deleteRecord(selectedRecord.hiveNo)}>Delete Hive</button>
            <button onClick={clearForm}>Cancel Update</button>
          </>
        )}
      </div>

      {/* Display Records */}
      <ul>
        {records.map((item) => (
          <li key={item.hiveNo} style={styles.record}>
            <p>Hive No: {item.hiveNo}</p>
            <p>Humidity: {item.humidity}</p>
            <p>Temperature: {item.temperature}</p>
            <p>Bee In/Out: {item.beeInOut}</p>
            <p>Raindrops: {item.raindrops}</p>
            <p>Current Date Time: {item.currentDateTime}</p>
            <p>Expected Harvest Date: {item.ExpectedHarvestDate}</p>
            <p>Honey Level: {item.honeylevel}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  input: {
    borderWidth: '1px',
    borderColor: '#ccc',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    width: '100%',
  },
  buttonContainer: {
    marginTop: '20px',
  },
  searchContainer: {
    marginBottom: '20px',
  },
  record: {
    padding: '15px',
    borderBottom: '1px solid #ccc',
  },
};

export default QRScreen;
