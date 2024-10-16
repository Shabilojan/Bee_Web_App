const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret for JWT
const JWT_SECRET = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // Replace with a secure secret in production


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
//------------------------------Login and logout----------------------------------------------------------------
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send({ success: false, message: 'Database error' });
        }

        console.log(results)

        if (results.length > 0) {
            const user = results[0]; // Get the first result

            // Compare the hashed password with the provided password
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                // Passwords match, create a JWT token
                const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

                // Send the token and user role in the response
                return res.send({ success: true, token, role: user.role, message: 'Login successful' });
            } else {
                return res.send({ success: false, message: 'Invalid credentials' });
            }
        } else {
            return res.send({ success: false, message: 'Invalid credentials' });
        }
    });
});


//------------------------------User creation----------------------------------------------------------------

app.post('/user-details', async (req, res) => {
    const { name, email, phoneNumber, password, profilePicture,role , username} = req.body;

    // Basic validatio
    if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Check if the user already exists
        const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                console.error('Error checking user:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'User already exists' });
            }

            
            const hashedPassword = await bcrypt.hash(password, 10); 
            console.log(hashedPassword)

            const newUser = {
                name,
                email,
                phoneNumber,
                password: hashedPassword,
                profilePicture,
                username,
                role 
            };

            // Insert user into the database
            const insertUserQuery = 'INSERT INTO users SET ?';
            db.query(insertUserQuery, newUser, (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ success: false, message: 'Database error' });
                }

                // Generate JWT token
                const token = jwt.sign({ id: result.insertId, name, email }, JWT_SECRET, {
                    expiresIn: '1h', 
                });

                res.json({
                    success: true,
                    message: 'User created successfully',
                    userId: result.insertId,
                    token, 
                });
            });
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Something went wrong, please try again later' });
    }
});




//------------------------------Hive deatails for specific hive----------------------------------------------------------------
app.get('/hive-details', (req, res) => {
    const hiveNo = req.query.hiveNo;

    let query;
    let queryParams = [];

    // If hiveNo is provided, fetch details for that specific hive
    if (hiveNo) {
        query = 'SELECT * FROM hives WHERE hiveNo = ?';
        queryParams = [hiveNo];
    } else {
        // If no hiveNo is provided, fetch details for all hives
        query = 'SELECT * FROM hives';
    }

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send({ success: false, message: 'Database error' });
            return;
        }

        if (results.length > 0) {
            // Return results based on whether a specific hive was queried
            res.send({ success: true, data: hiveNo ? results[0] : results });
        } else {
            res.send({ success: false, message: hiveNo ? `No hive details found for hive number ${hiveNo}` : 'No hive details found' });
        }
    });
});



//------------------------------Hive updation and deletation----------------------------------------------------------------

app.put('/hive-details', (req, res) => {
    const { hiveNo, humidity, temperature, beeInOut, raindrops, expectedHarvestDate, honeyLevel } = req.body;
    const updatedHive = { humidity, temperature, beeInOut, raindrops, expectedHarvestDate, honeyLevel };
    db.query('UPDATE hives SET ? WHERE hiveNo = ?', [updatedHive, hiveNo], (err) => {
        if (err) return res.status(500).send('Error updating hive');
        res.send('Hive updated successfully');
    });
});

// Delete hive
app.delete('/hive-details', (req, res) => {
    const { hiveNo } = req.query;
    db.query('DELETE FROM hives WHERE hiveNo = ?', [hiveNo], (err) => {
        if (err) return res.status(500).send('Error deleting hive');
        res.send('Hive deleted successfully');
    });
});



//------------------------------Hive creation----------------------------------------------------------------
app.post('/hive-details', (req, res) => {
    const { hiveNo, humidity, temperature, beeInOut, raindrops, expectedHarvestDate } = req.body;

    const query = `INSERT INTO hives (hiveNo, humidity, temperature, beeInOut, raindrops, ExpectedHarvestDate) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [hiveNo, humidity, temperature, beeInOut, raindrops, expectedHarvestDate];

    db.query(query, values, (error, results) => {
        if (error) {
            console.error('Error creating hive:', error);
            res.status(500).json({ success: false, message: 'Failed to create hive' });
        } else {
            res.status(200).json({ success: true, message: `Hive #${hiveNo} created successfully!` });
        }
    });
});





//------------------------------user updation----------------------------------------------------------------
app.put('/user-details/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, phoneNumber, profilePicture } = req.body;

    const query = 'UPDATE users SET name = ?, email = ?, phoneNumber = ?, profilePicture = ? WHERE id = ?';
    db.query(query, [name, email, phoneNumber, profilePicture, userId], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }
        res.json({ success: true, message: 'User updated' });
    });
});

//------------------------------User deletation----------------------------------------------------------------
app.delete('/user-details/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';

    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }
        res.json({ success: true, message: 'User deleted' });
    });
});

//------------------------------Get user by id----------------------------------------------------------------
app.get('/user-details/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'SELECT * FROM users WHERE id = ?';

    db.query(query, [userId], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database error' });
            return;
        }
        if (result.length > 0) {
            res.json({ success: true, data: result[0] });
        } else {
            res.json({ success: false, message: 'User not found' });
        }
    });
});


// Start server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
