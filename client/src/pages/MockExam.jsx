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

    // Corrected: Updated IDs to match the database's topic field and used new colors
    const subjects = [
        { id: 'OOP', name: 'Object-Oriented Programming', color: '#4FC3F7' },
        { id: 'CN', name: 'Computer Networks', color: '#4FC3F7' },
        { id: 'DBMS', name: 'Database Management', color: '#4FC3F7' },
        { id: 'DSA', name: 'Data Structures & Algorithms', color: '#4FC3F7' },
        { id: 'OS', name: 'Operating Systems', color: '#4FC3F7' }
    ];

    // --- STYLES (Updated for the light theme) ---
    const pageLayoutStyles = { 
        display: 'flex', 
        minHeight: '100vh', 
        backgroundColor: '#F0F4F8' 
    };
    const mainContentStyles = { 
        flex: 1, 
        padding: '30px', 
        backgroundColor: '#F0F4F8' 
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
        backgroundColor: '#FFFFFF', 
        padding: '25px', 
        borderRadius: '12px', 
        border: '1px solid #E0E0E0', 
        cursor: 'pointer', 
        transition: 'all 0.3s ease', 
        height: '100%' 
    };

    if (!user) {
        return (
            <div style={{
                backgroundColor: '#F0F4F8', 
                height: '100vh', 
                color: '#2C3E50', 
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
                    <h1 style={{ color: '#2C3E50', marginBottom: '20px' }}>
                        Mock Exam Subjects
                    </h1>
                    <p style={{ color: '#607D8B', marginBottom: '30px' }}>
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