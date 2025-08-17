import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios to make API calls

// --- STYLES (can be moved to a CSS file) ---
const formContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#0A192F',
};

const formStyles = {
  width: '350px',
  padding: '40px',
  backgroundColor: '#112240',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  color: '#ccd6f6',
};

const inputStyles = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px',
  marginBottom: '20px',
  backgroundColor: '#0A192F',
  border: '1px solid #233554',
  borderRadius: '5px',
  color: '#ccd6f6',
  fontSize: '1rem',
};

const buttonStyles = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#64FFDA',
  border: 'none',
  borderRadius: '5px',
  color: '#0A192F',
  fontSize: '1rem',
  fontWeight: 'bold',
  cursor: 'pointer',
};

const SignupPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      // Corrected: Send POST request to the new consolidated backend endpoint
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);

      console.log('Signup successful, token:', res.data.token);
      
      // Save the token in localStorage for authentication
      localStorage.setItem('token', res.data.token);
      
      navigate('/dashboard'); // Redirect to the dashboard on success
    } catch (err) {
      // Log any errors from the backend
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
          Already have an account? <Link to="/login" style={{color: '#64FFDA'}}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;