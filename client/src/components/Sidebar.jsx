import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const Sidebar = ({ user, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- Enhanced Styles ---
    const sidebarStyles = {
        width: '250px',
        backgroundColor: '#FFFFFF',
        padding: '20px',
        color: '#2C3E50',
        borderRight: '1px solid #E0E0E0',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
    };

    const navContainerStyles = {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
    };

    const navLinkStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        color: '#78909C', // Muted secondary text
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
        transition: 'all 0.2s ease-in-out',
        // This is a common way to handle hover in CSS-in-JS for better performance
        // You would typically use a separate CSS file or a library for this.
        // For a simple solution, let's keep it clean.
    };

    const activeLinkStyles = {
        ...navLinkStyles,
        backgroundColor: '#E1F5FE', // Very light blue background
        color: '#0288D1', // Dark blue text
        fontWeight: 'bold',
        transform: 'translateX(5px)',
    };

    const userProfileStyles = {
        borderTop: '1px solid #E0E0E0',
        paddingTop: '20px',
        flexShrink: 0,
        marginTop: 'auto',
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
        color: '#2C3E50',
        transition: 'background-color 0.2s',
        // Hover effect would be handled with a library or a separate CSS class
    };

    const logoutBtnStyles = {
        backgroundColor: '#E57373', // Soft red
        border: 'none',
        color: '#FFFFFF',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '15px',
        width: '100%',
        fontWeight: 'bold',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease-in-out',
    };
    
    // Helper to check if a path is active
    const isActive = (path) => location.pathname.startsWith(path);
    
    // Links with a simple hover effect
    const NavLink = ({ to, children }) => {
        const [isHovered, setIsHovered] = useState(false);
        const style = isActive(to) ? activeLinkStyles : isHovered ? { ...navLinkStyles, backgroundColor: '#F5F5F5' } : navLinkStyles;
        
        return (
            <Link 
                to={to} 
                style={style}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {children}
            </Link>
        );
    };

    return (
        <aside style={sidebarStyles}>
            <h1 style={{ color: '#2C3E50', textAlign: 'center', flexShrink: 0, cursor: 'pointer', fontSize: '1.8rem' }} onClick={() => navigate('/dashboard')}>
                Kodthunamm<span style={{ color: '#4FC3F7' }}>.</span>
            </h1>

            <nav style={navContainerStyles}>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/mock-interview">Mock Interview</NavLink>
                <NavLink to="/attempt-simulation">Attempt Simulation</NavLink>
                <NavLink to="/mock-exam">Mock Exam</NavLink>
                <NavLink to="/coding-problems">Coding Problems</NavLink>
                <NavLink to="/ai-profile-review">AI Profile Review</NavLink>
                <NavLink to="/ranking">Ranking</NavLink>
                <NavLink to="/study-resources">Study Resources</NavLink>
                <NavLink to="/resume-builder">Resume Builder</NavLink>
                <NavLink to="/account-settings">Account Settings</NavLink>
            </nav>

            <div style={userProfileStyles}>
                <button style={userProfileButtonStyles} onClick={() => navigate('/account-settings')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#607D8B'}}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <h3 style={{ color: '#2C3E50', margin: 0, fontSize: '1rem' }}>{user ? user.name : 'User'}</h3>
                </button>
                <button style={logoutBtnStyles} onClick={onLogout}>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;