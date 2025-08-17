import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- STYLES (Updated for the light theme) ---
const formContainerStyles = { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    backgroundColor: '#F0F4F8' 
};
const formStyles = { 
    width: '350px', 
    padding: '40px', 
    backgroundColor: '#FFFFFF', 
    borderRadius: '12px', 
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
    color: '#2C3E50' 
};
const inputStyles = { 
    width: '100%', 
    boxSizing: 'border-box', 
    padding: '12px', 
    marginBottom: '20px', 
    backgroundColor: '#F0F4F8', 
    border: '1px solid #E0E0E0', 
    borderRadius: '5px', 
    color: '#2C3E50', 
    fontSize: '1rem' 
};
const buttonStyles = { 
    width: '100%', 
    padding: '12px', 
    backgroundColor: '#4FC3F7', 
    border: 'none', 
    borderRadius: '5px', 
    color: '#FFFFFF', 
    fontSize: '1rem', 
    fontWeight: 'bold', 
    cursor: 'pointer' 
};

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            console.log('Signup successful, token:', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            console.error('Signup error:', err.response.data.msg);
        }
    };

    return (
        <div style={formContainerStyles}>
            <form style={formStyles} onSubmit={onSubmit}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Account</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    style={inputStyles}
                    value={formData.name}
                    onChange={onChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    style={inputStyles}
                    value={formData.email}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    style={inputStyles}
                    value={formData.password}
                    onChange={onChange}
                    minLength="6"
                    required
                />
                <button type="submit" style={buttonStyles}>Sign Up</button>
                <p style={{textAlign: 'center', marginTop: '20px'}}>
                    Already have an account? <Link to="/login" style={{color: '#4FC3F7'}}>Login</Link>
                </p>
            </form>
        </div>
    );
};

export default SignupPage;