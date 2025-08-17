import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MockExam from "./pages/MockExam.jsx"; // The subject list page
import SubjectExams from "./pages/SubjectExams.jsx"; // The exam list page
import ExamPage from "./pages/ExamPage.jsx"; // The exam taking page
import StudyResources from "./pages/StudyResources.jsx";
import ResumeBuilder from "./pages/ResumeBuilder.jsx";

// Styles
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Mock Exam Routes */}
          <Route path="/mock-exam" element={<MockExam />} />
          <Route path="/mock-exam/:subjectId" element={<SubjectExams />} />
          <Route path="/exam/:subjectId/:examId" element={<ExamPage />} />

          {/* Study & Resume */}
          <Route path="/study-resources" element={<StudyResources />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
