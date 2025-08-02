import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    // Login logic will go here
    console.log('Form submitted', formData);
    navigate('/dashboard'); 
  };

  return (
    <div style={formContainerStyles}>
      <form style={formStyles} onSubmit={onSubmit}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Login</h2>
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
          required
        />
        <button type="submit" style={buttonStyles}>Login</button>
        <p style={{textAlign: 'center', marginTop: '20px'}}>
            Don't have an account? <Link to="/signup" style={{color: '#64FFDA'}}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
