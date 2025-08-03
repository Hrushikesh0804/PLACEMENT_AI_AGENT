import React from 'react';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a192f' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: '20px',
        backgroundColor: '#0a192f'
      }}>
        <div>
          <h1 style={{ color: '#E6F1FF', marginBottom: '20px' }}>Your Dashboard</h1>
          
          {/* Dashboard Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Overall Score Card */}
            <div style={{
              backgroundColor: '#112240',
              padding: '25px',
              borderRadius: '12px',
              border: '1px solid #233554'
            }}>
              <h3 style={{ color: '#a8b2d1', fontSize: '16px', marginBottom: '15px' }}>Overall Score</h3>
              <div style={{ color: '#E6F1FF', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>85%</div>
              <div style={{ color: '#64FFDA', fontSize: '14px' }}>↑ 5% from last month</div>
            </div>

            {/* Problems Solved Card */}
            <div style={{
              backgroundColor: '#112240',
              padding: '25px',
              borderRadius: '12px',
              border: '1px solid #233554'
            }}>
              <h3 style={{ color: '#a8b2d1', fontSize: '16px', marginBottom: '15px' }}>Problems Solved</h3>
              <div style={{ color: '#E6F1FF', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>124</div>
              <div style={{ color: '#64FFDA', fontSize: '14px' }}>+ 12 new this month</div>
            </div>

            {/* Current Rank Card */}
            <div style={{
              backgroundColor: '#112240',
              padding: '25px',
              borderRadius: '12px',
              border: '1px solid #233554'
            }}>
              <h3 style={{ color: '#a8b2d1', fontSize: '16px', marginBottom: '15px' }}>Current Rank</h3>
              <div style={{ color: '#E6F1FF', fontSize: '48px', fontWeight: 'bold', marginBottom: '10px' }}>#42</div>
              <div style={{ color: '#ff6b6b', fontSize: '14px' }}>↓ 3 from last month</div>
            </div>
          </div>

          {/* Additional sections */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '20px'
          }}>
            {/* Upcoming Interviews */}
            <div style={{
              backgroundColor: '#112240',
              padding: '25px',
              borderRadius: '12px',
              border: '1px solid #233554'
            }}>
              <h3 style={{ color: '#E6F1FF', fontSize: '18px', marginBottom: '15px' }}>Upcoming Interviews</h3>
              <p style={{ color: '#a8b2d1' }}>No upcoming interviews scheduled.</p>
            </div>

            {/* AI-Suggested */}
            <div style={{
              backgroundColor: '#112240',
              padding: '25px',
              borderRadius: '12px',
              border: '1px solid #233554'
            }}>
              <h3 style={{ color: '#E6F1FF', fontSize: '18px', marginBottom: '15px' }}>AI-Suggested</h3>
              <p style={{ color: '#a8b2d1' }}>Practice data structures and algorithms.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;