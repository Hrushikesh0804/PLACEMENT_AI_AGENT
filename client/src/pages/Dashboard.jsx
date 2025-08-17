import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx'; // Import the new Sidebar component

// --- Reusable MetricCard Component ---
const MetricCard = ({ title, value, change, changeType }) => {
    const cardStyles = { 
        backgroundColor: '#FFFFFF', 
        padding: '25px', 
        borderRadius: '12px', 
        border: '1px solid #E0E0E0' 
    };
    const metricStyles = { 
        fontSize: '2.5rem', 
        color: '#2C3E50', 
        fontWeight: 'bold', 
        margin: '10px 0' 
    };
    const changeStyles = { 
        fontSize: '0.9rem', 
        color: changeType === 'positive' ? '#4CAF50' : '#F44336' 
    };
    
    return (
        <div style={cardStyles}>
            <h3 style={{ marginTop: 0, color: '#607D8B', fontSize: '1rem', fontWeight: 500 }}>{title}</h3>
            <div style={metricStyles}>{value}</div>
            <div style={changeStyles}>{change}</div>
        </div>
    );
};

// --- Main Dashboard Component ---
const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('http://localhost:5000/api/auth/me', config);
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user data', err);
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const onLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    // --- Styles ---
    const dashboardContainerStyles = { display: 'flex', height: '100vh', backgroundColor: '#F0F4F8', fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` };
    const mainContentStyles = { flexGrow: 1, padding: '30px', color: '#2C3E50', height: '100vh', overflowY: 'auto' };
    const metricCardsContainerStyles = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', margin: '30px 0' };
    const contentGridStyles = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' };
    const contentCardStyles = { backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', border: '1px solid #E0E0E0' };
    const contentCardTitleStyles = { marginTop: 0, color: '#2C3E50', borderBottom: '1px solid #E0E0E0', paddingBottom: '15px', marginBottom: '20px' };
    const interviewItemStyles = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #E0E0E0' };
    const detailsBtnStyles = { backgroundColor: 'transparent', border: '1px solid #4FC3F7', color: '#4FC3F7', padding: '8px 18px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' };
    const suggestionItemStyles = { padding: '10px 0', borderBottom: '1px solid #E0E0E0', color: '#607D8B', display: 'flex', alignItems: 'center' };

    if (!user) {
        return <div style={{backgroundColor: '#F0F4F8', height: '100vh', color: '#2C3E50', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;
    }

    return (
        <div style={dashboardContainerStyles}>
            <Sidebar user={user} onLogout={onLogout} />
            <main style={mainContentStyles}>
                <header>
                    <h2 style={{color: '#2C3E50', fontSize: '2rem'}}>Your Dashboard</h2>
                </header>
                <section style={metricCardsContainerStyles}>
                    <MetricCard title="Overall Score" value="85%" change="↑ 5% from last month" changeType="positive" />
                    <MetricCard title="Problems Solved" value="124" change="+ 12 new this month" changeType="positive" />
                    <MetricCard title="Current Rank" value="#42" change="↓ 3 from last month" changeType="negative" />
                </section>
                <section style={contentGridStyles}>
                    <div style={contentCardStyles}>
                        <h3 style={contentCardTitleStyles}>Upcoming Interviews</h3>
                        <div>
                            <div style={interviewItemStyles}>
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#2C3E50' }}>Software Engineer Intern</h4>
                                    <p style={{ margin: '4px 0', color: '#607D8B' }}>Tech Solutions Inc.</p>
                                </div>
                                <button style={detailsBtnStyles}>View Details</button>
                            </div>
                            <div style={{...interviewItemStyles, borderBottom: 'none'}}>
                                <div>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#2C3E50' }}>Frontend Developer</h4>
                                    <p style={{ margin: '4px 0', color: '#607D8B' }}>Creative Designs LLC</p>
                                </div>
                                <button style={detailsBtnStyles}>View Details</button>
                            </div>
                        </div>
                    </div>
                    <div style={contentCardStyles}>
                        <h3 style={contentCardTitleStyles}>AI-Suggested Practice</h3>
                        <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                            <li style={suggestionItemStyles}><span style={{marginRight: '15px', color: '#4FC3F7'}}>⚡</span>Focus on advanced Array manipulation.</li>
                            <li style={suggestionItemStyles}><span style={{marginRight: '15px', color: '#4FC3F7'}}>⚡</span>Practice Dynamic Programming problems.</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Dashboard;