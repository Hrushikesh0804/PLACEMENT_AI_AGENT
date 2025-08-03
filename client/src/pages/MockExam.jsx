import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MockExam = () => {
  const subjects = [
    {
      id: 'oops',
      name: 'Object-Oriented Programming (OOPs)',
      description: 'Test your knowledge of OOP concepts, classes, inheritance, polymorphism, and encapsulation.',
      duration: '90 minutes',
      totalExams: 5,
      questionsPerExam: 30,
      color: '#64FFDA'
    },
    {
      id: 'cn',
      name: 'Computer Networks (CN)',
      description: 'Evaluate your understanding of networking protocols, OSI model, TCP/IP, and network security.',
      duration: '90 minutes',
      totalExams: 5,
      questionsPerExam: 30,
      color: '#ff6b6b'
    },
    {
      id: 'dbms',
      name: 'Database Management Systems (DBMS)',
      description: 'Challenge yourself with SQL queries, normalization, transactions, and database design.',
      duration: '90 minutes',
      totalExams: 5,
      questionsPerExam: 30,
      color: '#4ecdc4'
    },
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms (DSA)',
      description: 'Master arrays, linked lists, trees, graphs, sorting, and searching algorithms.',
      duration: '90 minutes',
      totalExams: 5,
      questionsPerExam: 30,
      color: '#45b7d1'
    },
    {
      id: 'os',
      name: 'Operating Systems (OS)',
      description: 'Test your knowledge of process management, memory management, and file systems.',
      duration: '90 minutes',
      totalExams: 5,
      questionsPerExam: 30,
      color: '#f9ca24'
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a192f' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: '20px',
        backgroundColor: '#0a192f'
      }}>
        <div>
          <h1 style={{ color: '#E6F1FF', marginBottom: '20px' }}>Mock Exam</h1>
          <p style={{ color: '#a8b2d1', marginBottom: '30px' }}>Choose your subject below:</p>
          
          {/* Subject Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
            gap: '20px'
          }}>
            {subjects.map((subject) => (
              <Link
                key={subject.id}
                to={`/mock-exam/${subject.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  backgroundColor: '#112240',
                  padding: '25px',
                  borderRadius: '12px',
                  border: '1px solid #233554',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = subject.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 10px 25px rgba(0,0,0,0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#233554';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <h3 style={{ 
                    color: subject.color, 
                    fontSize: '18px', 
                    marginBottom: '15px',
                    fontWeight: 'bold'
                  }}>
                    {subject.name}
                  </h3>
                  <p style={{ 
                    color: '#a8b2d1', 
                    fontSize: '14px', 
                    marginBottom: '20px',
                    lineHeight: '1.5'
                  }}>
                    {subject.description}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <span style={{ color: '#E6F1FF', fontSize: '12px' }}>
                      Duration: {subject.duration}
                    </span>
                    <span style={{ color: '#E6F1FF', fontSize: '12px' }}>
                      {subject.totalExams} Exams Available
                    </span>
                  </div>
                  <div style={{ color: '#64FFDA', fontSize: '12px', fontWeight: 'bold' }}>
                    {subject.questionsPerExam} Questions per Exam
                  </div>
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