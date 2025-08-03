import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const SubjectExams = () => {
  const { subjectId } = useParams();
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const subjectNames = {
    'oops': 'Object-Oriented Programming (OOPs)',
    'cn': 'Computer Networks (CN)',
    'dbms': 'Database Management Systems (DBMS)', 
    'dsa': 'Data Structures & Algorithms (DSA)',
    'os': 'Operating Systems (OS)'
  };

  const subjectColors = {
    'oops': '#64FFDA',
    'cn': '#ff6b6b',
    'dbms': '#4ecdc4',
    'dsa': '#45b7d1',
    'os': '#f9ca24'
  };

  useEffect(() => {
    // Load exam data from API
    const loadExamData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/subjects/${subjectId}/exams`);
        const data = await response.json();
        setExamData(data);
      } catch (error) {
        console.error('Error loading exam data:', error);
        // Fallback sample data
        setExamData(generateSampleExams(subjectId));
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, [subjectId]);

  const generateSampleExams = (subject) => {
    const examTitles = {
      'oops': [
        'OOP Fundamentals & Classes',
        'Inheritance & Polymorphism', 
        'Encapsulation & Abstraction',
        'Advanced OOP Concepts',
        'Design Patterns & Best Practices'
      ],
      'cn': [
        'Network Fundamentals & OSI Model',
        'TCP/IP Protocol Suite',
        'Routing & Switching',
        'Network Security & Protocols',
        'Wireless Networks & Internet'
      ],
      'dbms': [
        'Database Fundamentals & ER Model',
        'SQL Queries & Operations',
        'Normalization & Schema Design',
        'Transactions & Concurrency',
        'Indexing & Query Optimization'
      ],
      'dsa': [
        'Arrays & Linked Lists',
        'Stacks, Queues & Trees',
        'Graph Algorithms',
        'Sorting & Searching',
        'Dynamic Programming & Greedy'
      ],
      'os': [
        'Process Management',
        'Memory Management',
        'File Systems',
        'CPU Scheduling',
        'Synchronization & Deadlocks'
      ]
    };

    return examTitles[subject].map((title, index) => ({
      id: index + 1,
      title: title,
      questions: 30,
      duration: 90,
      difficulty: index < 2 ? 'Easy' : index < 4 ? 'Medium' : 'Hard',
      completed: Math.random() > 0.7, // Random completion status
      bestScore: Math.random() > 0.5 ? Math.floor(Math.random() * 30) + 15 : null
    }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a192f' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px', backgroundColor: '#0a192f' }}>
          <div style={{ color: '#E6F1FF', textAlign: 'center', paddingTop: '50px' }}>
            Loading exams...
          </div>
        </main>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#64FFDA';
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a192f' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#0a192f' }}>
        <div>
          {/* Header */}
          <div style={{ marginBottom: '30px' }}>
            <Link 
              to="/mock-exam" 
              style={{ 
                color: '#64FFDA', 
                textDecoration: 'none', 
                fontSize: '14px',
                marginBottom: '10px',
                display: 'inline-block'
              }}
            >
              ← Back to Subjects
            </Link>
            <h1 style={{ color: '#E6F1FF', marginBottom: '10px' }}>
              {subjectNames[subjectId]} Exams
            </h1>
            <p style={{ color: '#a8b2d1' }}>
              Choose from 5 comprehensive exams, each with 30 questions
            </p>
          </div>

          {/* Exam Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '20px'
          }}>
            {examData && examData.map((exam) => (
              <div key={exam.id} style={{
                backgroundColor: '#112240',
                padding: '25px',
                borderRadius: '12px',
                border: '1px solid #233554',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = subjectColors[subjectId];
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#233554';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                
                {/* Completion Badge */}
                {exam.completed && (
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold'
                  }}>
                    COMPLETED
                  </div>
                )}

                {/* Exam Title */}
                <h3 style={{ 
                  color: subjectColors[subjectId], 
                  fontSize: '18px', 
                  marginBottom: '15px',
                  fontWeight: 'bold'
                }}>
                  Exam {exam.id}: {exam.title}
                </h3>

                {/* Exam Details */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '8px'
                  }}>
                    <span style={{ color: '#a8b2d1', fontSize: '14px' }}>
                      Questions: {exam.questions}
                    </span>
                    <span style={{ color: '#a8b2d1', fontSize: '14px' }}>
                      Duration: {exam.duration} minutes
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      color: getDifficultyColor(exam.difficulty), 
                      fontSize: '12px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      backgroundColor: 'rgba(100, 255, 218, 0.1)',
                      borderRadius: '4px'
                    }}>
                      {exam.difficulty}
                    </span>
                    
                    {exam.bestScore && (
                      <span style={{ color: '#64FFDA', fontSize: '12px' }}>
                        Best Score: {exam.bestScore}/30
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/exam/${subjectId}/${exam.id}`}
                  style={{
                    display: 'inline-block',
                    backgroundColor: subjectColors[subjectId],
                    color: '#112240',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '0.8';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '1';
                  }}
                >
                  {exam.completed ? 'Retake Exam' : 'Start Exam'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectExams;