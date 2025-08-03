import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- Reusable Components (defined within the same file for simplicity) ---

const MetricCard = ({ title, value, change, changeType }) => {
  const cardStyles = { backgroundColor: '#112240', padding: '25px', borderRadius: '12px', border: '1px solid #233554' };
  const metricStyles = { fontSize: '2.5rem', color: '#E6F1FF', fontWeight: 'bold', margin: '10px 0' };
  const changeStyles = { fontSize: '0.9rem', color: changeType === 'positive' ? '#64FFDA' : '#ff6489' };
  
  return (
    <div style={cardStyles}>
      <h3 style={{ marginTop: 0, color: '#ccd6f6', fontSize: '1rem', fontWeight: 500 }}>{title}</h3>
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
        const res = await axios.get('http://localhost:5000/api/users/me', config);
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
  const dashboardContainerStyles = { display: 'flex', height: '100vh', backgroundColor: '#0A192F', fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif` };
  
  // --- Sidebar Styles for Independent Scrolling ---
  const sidebarStyles = { width: '250px', backgroundColor: '#112240', padding: '20px', color: '#a8b2d1', borderRight: '1px solid #233554', display: 'flex', flexDirection: 'column', height: '100vh' };
  const sidebarNavContainerStyles = { flexGrow: 1, overflowY: 'auto', paddingRight: '10px' }; // This container will scroll
  
  // --- Main Content Styles for Independent Scrolling ---
  const mainContentStyles = { flexGrow: 1, padding: '30px', color: '#ccd6f6', height: '100vh', overflowY: 'auto' };

  const navButtonStyles = { display: 'flex', alignItems: 'center', gap: '15px', color: '#a8b2d1', textDecoration: 'none', padding: '15px 10px', borderRadius: '8px', marginBottom: '10px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'inherit', fontSize: 'inherit' };
  const userProfileStyles = { borderTop: '1px solid #233554', paddingTop: '20px', textAlign: 'center', flexShrink: 0 }; // Prevents this section from shrinking
  const logoutBtnStyles = { background: 'none', border: '1px solid #64FFDA', color: '#64FFDA', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', marginTop: '15px', width: '100%' };
  const metricCardsContainerStyles = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px', margin: '30px 0' };
  const contentGridStyles = { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' };
  const contentCardStyles = { backgroundColor: '#112240', padding: '25px', borderRadius: '12px', border: '1px solid #233554' };
  const contentCardTitleStyles = { marginTop: 0, color: '#E6F1FF', borderBottom: '1px solid #233554', paddingBottom: '15px', marginBottom: '20px' };
  const interviewItemStyles = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #233554' };
  const detailsBtnStyles = { backgroundColor: 'transparent', border: '1px solid #64FFDA', color: '#64FFDA', padding: '8px 18px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap' };
  const suggestionItemStyles = { padding: '10px 0', borderBottom: '1px solid #233554', color: '#a8b2d1', display: 'flex', alignItems: 'center' };

  if (!user) {
    return <div style={{backgroundColor: '#0A192F', height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>;
  }

  return (
    <div style={dashboardContainerStyles}>
      {/* Sidebar */}
      <aside style={sidebarStyles}>
        <h1 style={{ color: '#E6F1FF', textAlign: 'center', flexShrink: 0 }}>Kodthunamm<span style={{color: '#64FFDA'}}>.</span></h1>
        
        {/* Scrollable Navigation Area */}
        <nav style={sidebarNavContainerStyles}>
          <button style={navButtonStyles}>Dashboard</button>
          <button style={navButtonStyles}>Mock Interview</button>
          <button style={navButtonStyles}>Attempt Simulation</button>
          <button style={navButtonStyles}>Mock Exam</button>
          <button style={navButtonStyles}>Coding Problems</button>
          <button style={navButtonStyles}>AI Profile Review</button>
          <button style={navButtonStyles}>Ranking</button>
          <button style={navButtonStyles}>Study Resources</button>
          <button style={navButtonStyles}>Resume Builder</button>
          <button style={navButtonStyles}>Account Settings</button>
        </nav>

        <div style={userProfileStyles}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'}}>
            {/* Generic User Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#ccd6f6'}}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <h3 style={{color: '#ccd6f6', margin: 0}}>{user.name}</h3>
          </div>
          <button style={logoutBtnStyles} onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={mainContentStyles}>
        <header>
            <h2 style={{color: '#E6F1FF', fontSize: '2rem'}}>Your Dashboard</h2>
        </header>

        <section style={metricCardsContainerStyles}>
            <MetricCard title="Overall Score" value="85%" change="&#x2191; 5% from last month" changeType="positive" />
            <MetricCard title="Problems Solved" value="124" change="&#x2B; 12 new this month" changeType="positive" />
            <MetricCard title="Current Rank" value="#42" change="&#x2193; 3 from last month" changeType="negative" />
        </section>

        <section style={contentGridStyles}>
            <div style={contentCardStyles}>
                <h3 style={contentCardTitleStyles}>Upcoming Interviews</h3>
                <div>
                    <div style={interviewItemStyles}>
                        <div>
                            <h4 style={{ margin: '0 0 8px 0', color: '#ccd6f6' }}>Software Engineer Intern</h4>
                            <p style={{ margin: '4px 0', color: '#a8b2d1' }}>Tech Solutions Inc.</p>
                            <p style={{ margin: '4px 0', color: '#a8b2d1' }}>August 10, 2025 - 11:00 AM</p>
                        </div>
                        <button style={detailsBtnStyles}>View Details</button>
                    </div>
                    <div style={{...interviewItemStyles, borderBottom: 'none'}}>
                         <div>
                            <h4 style={{ margin: '0 0 8px 0', color: '#ccd6f6' }}>Frontend Developer</h4>
                            <p style={{ margin: '4px 0', color: '#a8b2d1' }}>Creative Designs LLC</p>
                            <p style={{ margin: '4px 0', color: '#a8b2d1' }}>August 18, 2025 - 2:00 PM</p>
                        </div>
                        <button style={detailsBtnStyles}>View Details</button>
                    </div>
                </div>
            </div>

            <div style={contentCardStyles}>
                <h3 style={contentCardTitleStyles}>AI-Suggested Practice</h3>
                <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                    <li style={suggestionItemStyles}><span style={{marginRight: '15px', color: '#64FFDA'}}>⚡</span>Focus on advanced Array manipulation.</li>
                    <li style={suggestionItemStyles}><span style={{marginRight: '15px', color: '#64FFDA'}}>⚡</span>Practice Dynamic Programming problems.</li>
                    <li style={{...suggestionItemStyles, borderBottom: 'none'}}><span style={{marginRight: '15px', color: '#64FFDA'}}>⚡</span>Improve time complexity in sorting algorithms.</li>
                </ul>
            </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
            