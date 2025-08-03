import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Pages
import LandingPage from './pages/LandingPage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MockExam from './pages/MockExam.jsx';
import SubjectExams from './pages/SubjectExams.jsx';
import ExamPage from './pages/ExamPage.jsx';
// Styles
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes (without sidebar) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected Routes (with sidebar layout) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mock-exam" element={<MockExam />} />
          <Route path="/mock-exam/:subjectId" element={<SubjectExams />} />
          <Route path="/exam/:subjectId/:examId" element={<ExamPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;