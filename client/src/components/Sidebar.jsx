import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// This component assumes it receives user data and a logout function as props
const Sidebar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Styles ---
  const sidebarStyles = {
    width: '250px',
    backgroundColor: '#112240',
    padding: '20px',
    color: '#a8b2d1',
    borderRight: '1px solid #233554',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh', // Full viewport height
    boxSizing: 'border-box', // Ensures padding is included in the width
  };

  const navContainerStyles = {
    flexGrow: 1, // Allows this container to fill available space
    overflow: 'hidden', // This will hide any scrollbars
  };

  const navLinkStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    color: '#a8b2d1',
    textDecoration: 'none',
    padding: '15px 10px',
    borderRadius: '8px',
    marginBottom: '10px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
  };

  const activeLinkStyles = {
    ...navLinkStyles,
    backgroundColor: '#64FFDA',
    color: '#112240',
    fontWeight: 'bold',
  };

  const userProfileStyles = {
    borderTop: '1px solid #233554',
    paddingTop: '20px',
    flexShrink: 0, // Prevents this section from shrinking
  };

  const userProfileButtonStyles = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: '#ccd6f6',
  };

  const logoutBtnStyles = {
    background: 'none',
    border: '1px solid #ff6b6b',
    color: '#ff6b6b',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '15px',
    width: '100%',
  };

  // Helper to check if a path is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside style={sidebarStyles}>
      <h1 style={{ color: '#E6F1FF', textAlign: 'center', flexShrink: 0, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
        Kodthunamm<span style={{ color: '#64FFDA' }}>.</span>
      </h1>

      {/* This nav container will no longer scroll */}
      <nav style={navContainerStyles}>
        <Link to="/dashboard" style={isActive('/dashboard') ? activeLinkStyles : navLinkStyles}>
          Dashboard
        </Link>
        <Link to="/mock-interview" style={isActive('/mock-interview') ? activeLinkStyles : navLinkStyles}>
          Mock Interview
        </Link>
        <Link to="/attempt-simulation" style={isActive('/attempt-simulation') ? activeLinkStyles : navLinkStyles}>
          Attempt Simulation
        </Link>
        <Link to="/mock-exam" style={isActive('/mock-exam') ? activeLinkStyles : navLinkStyles}>
          Mock Exam
        </Link>
        <Link to="/coding-problems" style={isActive('/coding-problems') ? activeLinkStyles : navLinkStyles}>
          Coding Problems
        </Link>
        <Link to="/ai-profile-review" style={isActive('/ai-profile-review') ? activeLinkStyles : navLinkStyles}>
          AI Profile Review
        </Link>
        <Link to="/ranking" style={isActive('/ranking') ? activeLinkStyles : navLinkStyles}>
          Ranking
        </Link>
        <Link to="/study-resources" style={isActive('/study-resources') ? activeLinkStyles : navLinkStyles}>
          Study Resources
        </Link>
        <Link to="/resume-builder" style={isActive('/resume-builder') ? activeLinkStyles : navLinkStyles}>
          Resume Builder
        </Link>
        <Link to="/account-settings" style={isActive('/account-settings') ? activeLinkStyles : navLinkStyles}>
          Account Settings
        </Link>
      </nav>

      {/* User Profile Section - remains at the bottom */}
      <div style={userProfileStyles}>
        <button style={userProfileButtonStyles} onClick={() => navigate('/account-settings')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <h3 style={{ color: '#ccd6f6', margin: 0, fontSize: '1rem' }}>{user ? user.name : 'User'}</h3>
        </button>
        <button style={logoutBtnStyles} onClick={onLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
