const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Update with your MySQL username
    password: '', // Update with your MySQL password
    database: 'login_db', // Your existing database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send({ success: false, message: 'Database error' });
            return;
        }
        
        if (results.length > 0) {
            res.send({ success: true, message: 'Login successful' });
        } else {
            res.send({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Hive details for all hives
app.get('/hive-details', (req, res) => {
    const hiveNo = req.query.hiveNo;
    if (!hiveNo) {
        return res.status(400).json({ success: false, message: 'hiveNo parameter is required' });
    }

    const query = 'SELECT * FROM hives WHERE hiveNo = ?';
    db.query(query, [hiveNo], (err, results) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Database error' });
            return;
        }

        if (results.length > 0) {
            res.send({ success: true, data: results[0] }); // Return the first result
        } else {
            res.send({ success: false, message: `No hive details found for hive number ${hiveNo}` });
        }
    });
});

// Hive details for a specific hive by hiveNo
app.get('/hive-details', (req, res) => {
    const hiveNo = req.query.hiveNo;
    if (!hiveNo) {
        return res.status(400).json({ success: false, message: 'hiveNo parameter is required' });
    }

    const query = 'SELECT * FROM hives WHERE hiveNo = ?';
    db.query(query, [hiveNo], (err, results) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Database error' });
            return;
        }

        if (results.length > 0) {
            res.send({ success: true, data: results[0] }); // Return the first result
        } else {
            res.send({ success: false, message: `No hive details found for hive number ${hiveNo}` });
        }
    });
});


// Start server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
