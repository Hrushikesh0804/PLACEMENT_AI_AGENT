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

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            console.log('Login successful');
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err.response.data.msg);
        }
    };

    return (
        <div style={formContainerStyles}>
            <form style={formStyles} onSubmit={onSubmit}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
                <input type="email" name="email" placeholder="Email" style={inputStyles} value={formData.email} onChange={onChange} required />
                <input type="password" name="password" placeholder="Password" style={inputStyles} value={formData.password} onChange={onChange} required />
                <button type="submit" style={buttonStyles}>Login</button>
                <p style={{textAlign: 'center', marginTop: '20px'}}>
                    Don't have an account? <Link to="/signup" style={{color: '#4FC3F7'}}>Sign Up</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;