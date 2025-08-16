import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';

const MockExam = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5000/api/auth/me', config);
        setUser(res.data);
      } catch (error) {
        console.error("Auth error", error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    verifyUser();
  }, [navigate]);

  const onLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const subjects = [
    { id: 'OOP', name: 'Object-Oriented Programming', color: '#64FFDA' },
    { id: 'CN', name: 'Computer Networks', color: '#ff6b6b' },
    { id: 'DBMS', name: 'Database Management', color: '#4ecdc4' },
    { id: 'DSA', name: 'Data Structures & Algorithms', color: '#45b7d1' },
    { id: 'OS', name: 'Operating Systems', color: '#f9ca24' }
  ];

  // --- STYLES ---
  const pageLayoutStyles = { 
    display: 'flex', 
    minHeight: '100vh', 
    backgroundColor: '#0a192f' 
  };
  
  const mainContentStyles = { 
    flex: 1, 
    padding: '20px', 
    backgroundColor: '#0a192f' 
  };
  
  const cardGridStyles = { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
    gap: '20px' 
  };
  
  const cardLinkStyles = { 
    textDecoration: 'none' 
  };
  
  const cardStyles = { 
    backgroundColor: '#112240', 
    padding: '25px', 
    borderRadius: '12px', 
    border: '1px solid #233554', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease', 
    height: '100%' 
  };

  if (!user) {
    return (
      <div style={{
        backgroundColor: '#0A192F', 
        height: '100vh', 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={pageLayoutStyles}>
      <Sidebar user={user} onLogout={onLogout} />
      
      <main style={mainContentStyles}>
        <div>
          <h1 style={{ color: '#E6F1FF', marginBottom: '20px' }}>
            Mock Exam Subjects
          </h1>
          <p style={{ color: '#a8b2d1', marginBottom: '30px' }}>
            Choose a subject to see the available exams.
          </p>
          
          <div style={cardGridStyles}>
            {subjects.map((subject) => (
              <Link 
                key={subject.id} 
                to={`/mock-exam/${subject.id}`} 
                style={cardLinkStyles}
              >
                <div style={cardStyles}>
                  <h3 style={{ 
                    color: subject.color, 
                    fontSize: '18px', 
                    marginBottom: '15px' 
                  }}>
                    {subject.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MockExam;