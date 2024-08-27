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
    database: 'login_db', // Updated to use your existing database
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database');
});

// Endpoint to get hive details
app.get('/hives-details', (req, res) => {
    const query = 'SELECT * FROM hives';

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Database error' });
            return;
        }

        res.send({ success: true, data: results });
    });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

// Endpoint to get hive details by hive number
app.get('/hive-details', (req, res) => {
    const hiveNo = req.query.hiveNo;

    let query = 'SELECT * FROM hives';
    if (hiveNo) {
        query += ` WHERE hiveNo = ${db.escape(hiveNo)}`;
    }

    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send({ success: false, message: 'Database error' });
            return;
        }

        res.send({ success: true, data: results });
    });
});