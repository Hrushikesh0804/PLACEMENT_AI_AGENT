import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import all the page components
import LandingPage from './pages/LandingPage.jsx'; 
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MockExam from './pages/MockExam.jsx'; // The subject list page
import SubjectExams from './pages/SubjectExams.jsx'; // The exam list page
import ExamPage from './pages/ExamPage.jsx'; // The exam taking page

import './App.css'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Mock Exam Routes */}
          <Route path="/mock-exam" element={<MockExam />} />
          <Route path="/mock-exam/:subjectId" element={<SubjectExams />} />
          <Route path="/exam/:examId" element={<ExamPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
