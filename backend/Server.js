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

// Login endpoint
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    
//     db.query(query, [username, password], (err, results) => {
//         if (err) {
//             console.error('Error executing query:', err);
//             res.status(500).send({ success: false, message: 'Database error' });
//             return;
//         }
        
//         if (results.length > 0) {
//             const user = results[0]; // Assuming the first result is the correct user
//             res.send({ success: true, role: user.role, message: 'Login successful' });
//         } else {
//             res.send({ success: false, message: 'Invalid credentials' });
//         }
//     });
// });


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

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
            console.log(hashedPassword)

            const newUser = {
                name,
                email,
                phoneNumber,
                password: hashedPassword, // Save hashed password
                profilePicture,
                username,
                role // This can be a file path or URL
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
                    expiresIn: '1h', // Token valid for 1 hour
                });

                res.json({
                    success: true,
                    message: 'User created successfully',
                    userId: result.insertId,
                    token, // Send the token to the client
                });
            });
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Something went wrong, please try again later' });
    }
});



// Hive details for specific or all hives
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
            res.send({ success: true, data: results });
        } else {
            res.send({ success: false, message: hiveNo ? `No hive details found for hive number ${hiveNo}` : 'No hive details found' });
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

// Update hive details
app.put('/hivedetails/:hiveNo', (req, res) => {
    const hiveNo = req.params.hiveNo;
    const updatedHiveData = req.body; // The updated data from the frontend

    const query = 'UPDATE hives SET ? WHERE hiveNo = ?';
    db.query(query, [updatedHiveData, hiveNo], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, message: `Hive #${hiveNo} updated successfully.` });
    });
});

// Delete hive
app.delete('/hivedetails/:hiveNo', (req, res) => {
    const hiveNo = req.params.hiveNo;

    const query = 'DELETE FROM hives WHERE hiveNo = ?';
    db.query(query, [hiveNo], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, message: `Hive #${hiveNo} deleted successfully.` });
    });
});

// POST route to create a new hive
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

//------------------user management----------------
// Create user
// app.post('/user-details', (req, res) => {
//     const { name, email, phoneNumber, profilePicture } = req.body;
//     const newUser = { name, email, phoneNumber, profilePicture };
//     const query = 'INSERT INTO users SET ?';

//     db.query(query, newUser, (err, result) => {
//         if (err) {
//             res.status(500).json({ success: false, message: 'Database error' });
//             return;
//         }
//         res.json({ success: true, message: 'User created', userId: result.insertId });
//     });
// });




// Update user
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

// Delete user
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

// Get user by ID
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

// Get all users
app.get('/user-details/:id', (req, res) => {
    const userId = req.params.id; // User ID from URL

    // Validate that userId is a number (assuming ID is numeric)
    if (isNaN(userId)) {
        return res.status(400).send({ success: false, message: 'Invalid user ID format' });
    }

    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log the error for debugging
            return res.status(500).send({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            return res.send({ success: true, data: results[0] });  // Return the first result
        } else {
            return res.send({ success: false, message: `No user found with id ${userId}` });
        }
    });
});

// Start server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
