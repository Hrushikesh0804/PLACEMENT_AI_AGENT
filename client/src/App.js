import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage'; // Import the new landing page
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
