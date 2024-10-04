import React, { useState } from 'react';
import './UserRegistrationForm.css'; // Add your styles here

const UserRegistrationForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
        profilePicture: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            profilePicture: e.target.files[0],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic (e.g., send data to API)
        console.log(formData);
    };

    return (
        <div className="registration-form">
            <h2>User Registration</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Profile Picture:</label>
                    <input type="file" name="profilePicture" onChange={handleFileChange} />
                </div>
                <button type="submit">Register User</button>
            </form>
        </div>
    );
};

export default UserRegistrationForm;
