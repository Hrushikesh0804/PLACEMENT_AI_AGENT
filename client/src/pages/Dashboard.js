import React from 'react';
import Sidebar from '../components/Sidebar';
// You would import other components here as you build them
// import MetricCard from '../components/MetricCard';
// import UpcomingInterviews from '../components/UpcomingInterviews';
// import AISuggestions from '../components/AISuggestions';

const Dashboard = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '30px', backgroundColor: '#0A192F', color: '#ccd6f6' }}>
        <h1>Your Dashboard</h1>
        {/*
          This is where you would place the other components for the main content area.
          For example:
          <div className="metric-cards-container">
            <MetricCard title="Overall Score" value="85%" />
            <MetricCard title="Problems Solved" value="124" />
            <MetricCard title="Current Rank" value="#42" />
          </div>
          <div className="content-grid">
            <UpcomingInterviews />
            <AISuggestions />
          </div>
        */}
      </main>
    </div>
  );
};

export default Dashboard;
