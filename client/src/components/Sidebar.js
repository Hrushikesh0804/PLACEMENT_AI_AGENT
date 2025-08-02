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

const Sidebar = () => {
  return (
    <aside style={sidebarStyles}>
      <h1 style={{ color: '#E6F1FF', textAlign: 'center' }}>Kodthunamm<span style={{color: '#64FFDA'}}>.</span></h1>
      <nav>
        <a href="#" style={navLinkStyles}>Dashboard</a>
        <a href="#" style={navLinkStyles}>Mock Interview</a>
        <a href="#" style={navLinkStyles}>Attempt Simulation</a>
        <a href="#" style={navLinkStyles}>Mock Exam</a>
        <a href="#" style={navLinkStyles}>Coding Problems</a>
        <a href="#" style={navLinkStyles}>AI Profile Review</a>
        <a href="#" style={navLinkStyles}>Ranking</a>
        <a href="#" style={navLinkStyles}>Study Resources</a>
        <a href="#" style={navLinkStyles}>Resume Builder</a>
      </nav>
      {/* User Profile Section would go here */}
    </aside>
  );
};

export default Sidebar;
