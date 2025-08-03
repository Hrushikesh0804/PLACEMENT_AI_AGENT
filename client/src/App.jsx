import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import all the page components from their new .jsx files
import LandingPage from './pages/LandingPage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

// Import the CSS file
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Set the root path to the new LandingPage */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Keep the other routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
