import React from 'react';
import { Link } from 'react-router-dom';

// Styles for the landing page
const landingPageStyles = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#0A192F',
  color: '#E6F1FF',
  textAlign: 'center',
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
};

const navStyles = {
  position: 'absolute',
  top: '30px',
  right: '40px',
};

const buttonStyles = {
  textDecoration: 'none',
  padding: '12px 24px',
  margin: '0 10px',
  borderRadius: '6px',
  color: '#0A192F',
  backgroundColor: '#64FFDA',
  fontWeight: 'bold',
  transition: 'transform 0.2s ease-in-out',
  display: 'inline-block'
};

const titleStyles = {
    fontSize: '4.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
};

const subtitleStyles = {
    fontSize: '1.5rem',
    color: '#8892B0',
    maxWidth: '600px'
};

const LandingPage = () => {
  return (
    <div style={landingPageStyles}>
      <nav style={navStyles}>
        <Link to="/login" style={buttonStyles}>Login</Link>
        <Link to="/signup" style={buttonStyles}>Sign Up</Link>
      </nav>
      <div>
        <h1 style={titleStyles}>Welcome to Kodthunamm<span style={{color: '#64FFDA'}}>.</span></h1>
        <p style={subtitleStyles}>Your journey to acing the tech interview starts here.</p>
      </div>
    </div>
  );
};

export default LandingPage;
