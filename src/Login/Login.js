import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // For navigation


    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
    
            console.log(response.data); // Log the response for debugging
    
            if (response.data.success) {
                const userRole = response.data.role; // Role returned from the backend (Admin or user)
                const token = response.data.token; // JWT token
    
                // Store the JWT token and user role in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('role', userRole);
    
                setMessage('Login successful!');
    
                // Redirect based on the user's role
                if (userRole === 'Admin') {
                    navigate('/Admin'); // Navigate to AdminDashboard
                } else if (userRole === 'user') {
                    navigate('/user'); // Navigate to User Dashboard
                }
            } else {
                setMessage('Invalid credentials, please try again.');
            }
        } catch (error) {
            console.error('Error during login', error);
            setMessage('Something went wrong. Please try again later.');
        }
    };
    
    


    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Welcome</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="input-container">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="actions">
                        <div className="remember-forgot">
                            <label>
                                <input type="checkbox" />
                                Remember
                            </label>
                            <a href="/">Forgot Password?</a>
                           
                        </div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
            <div className="login-image">
                <img src={require('./Logo.png')} alt="Login Illustration" />
            </div>
        </div>
    );
};

export default Login;
