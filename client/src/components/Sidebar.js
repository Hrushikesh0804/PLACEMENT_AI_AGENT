import { Link, useLocation } from 'react-router-dom';
import React from 'react';

// Basic styles are included here for simplicity.
// In a real app, these would be in a separate CSS file.
const sidebarStyles = {
  width: '250px',
  height: '100vh',
  backgroundColor: '#112240',
  padding: '20px',
  color: '#a8b2d1',
  borderRight: '1px solid #233554'
};

const navLinkStyles = {
  display: 'block',
  color: '#a8b2d1',
  textDecoration: 'none',
  padding: '15px 10px',
  borderRadius: '8px',
  marginBottom: '10px'
};

const activeLinkStyles = {
  ...navLinkStyles,
  backgroundColor: '#64FFDA',
  color: '#112240'
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside style={sidebarStyles}>
      <h1 style={{ color: '#E6F1FF', textAlign: 'center' }}>Kodthunamm<span style={{color: '#64FFDA'}}>.</span></h1>
      <nav>
        <Link 
          to="/dashboard" 
          style={location.pathname === '/dashboard' ? activeLinkStyles : navLinkStyles}
        >
          Dashboard
        </Link>
        
        <a 
          href="#" 
          style={navLinkStyles}
          onClick={(e) => e.preventDefault()}
        >
          Mock Interview
        </a>
        
        <a 
          href="#" 
          style={navLinkStyles}
          onClick={(e) => e.preventDefault()}
        >
          Attempt Simulation
        </a>
        
        <Link 
          to="/mock-exam" 
          style={location.pathname === '/mock-exam' ? activeLinkStyles : navLinkStyles}
        >
          Mock Exam
        </Link>
        
        <a 
          href="#" 
          style={navLinkStyles}
          onClick={(e) => e.preventDefault()}
        >
          Coding Problems
        </a>
        
        <a 
          href="#" 
          style={navLinkStyles}
          onClick={(e) => e.preventDefault()}
        >
          AI Profile Review
        </a>
        
        <a 
          href="#" 
          style={navLinkStyles}
          onClick={(e) => e.preventDefault()}
        >
          Ranking
        </a>
        
        <a 
          href="#" 
          style={navLinkStyles}
          onClick={(e) => e.preventDefault()}
        >
          Study Resources
        </a>
        
        <a 
          href="#" 
          style={navLinkStyles}
          onClick={(e) => e.preventDefault()}
        >
          Resume Builder
        </a>
      </nav>
      {/* User Profile Section would go here */}
    </aside>
  );
};

export default Sidebar;