import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar.jsx';

const SubjectExams = () => {
    const { subjectId } = useParams();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Data and Styles (Updated for the light theme) ---
    const subjectNames = {
        'OOP': 'Object-Oriented Programming',
        'CN': 'Computer Networks',
        'DBMS': 'Database Management',
        'DSA': 'Data Structures & Algorithms',
        'OS': 'Operating Systems'
    };
    const subjectColors = {
        'OOP': '#4FC3F7',
        'CN': '#4FC3F7',
        'DBMS': '#4FC3F7',
        'DSA': '#4FC3F7',
        'OS': '#4FC3F7'
    };
    const getDifficultyColor = (difficulty) => ({ Easy: '#4CAF50', Medium: '#FF9800', Hard: '#F44336' }[difficulty] || '#4FC3F7');

    const pageLayoutStyles = { display: 'flex', minHeight: '100vh', backgroundColor: '#F0F4F8' };
    const mainContentStyles = { flex: 1, padding: '30px', backgroundColor: '#F0F4F8' };
    const cardGridStyles = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' };
    const cardStyles = { backgroundColor: '#FFFFFF', padding: '25px', borderRadius: '12px', border: '1px solid #E0E0E0' };

    const startExamLinkStyles = {
        textDecoration: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        color: '#FFFFFF',
        backgroundColor: subjectColors[subjectId],
        fontWeight: 'bold',
        transition: 'background-color 0.3s'
    };

    useEffect(() => {
        const loadPageData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                const config = { headers: { 'x-auth-token': token } };
                const [userRes, examsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/auth/me', config),
                    // CRITICAL FIX: The backend now returns exams with a 'completed' and 'bestScore' field
                    axios.get(`http://localhost:5000/api/mock-exam/subjects/${subjectId}/exams`, config)
                ]);
                setUser(userRes.data);
                setExams(examsRes.data);
                console.log('✅ Exam data fetched successfully:', examsRes.data);
            } catch (error) {
                console.error('❌ Error loading page data:', error);
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        loadPageData();
    }, [subjectId, navigate]);

    const onLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading || !user) {
        return <div style={{ backgroundColor: '#F0F4F8', height: '100vh', color: '#2C3E50', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    return (
        <div style={pageLayoutStyles}>
            <Sidebar user={user} onLogout={onLogout} />
            <main style={mainContentStyles}>
                <div>
                    <div style={{ marginBottom: '30px' }}>
                        <Link to="/mock-exam" style={{ color: '#4FC3F7', textDecoration: 'none' }}>← Back to Subjects</Link>
                        <h1 style={{ color: '#2C3E50' }}>{subjectNames[subjectId]} Exams</h1>
                    </div>
                    <div style={cardGridStyles}>
                        {exams.length > 0 ? exams.map((exam) => (
                            <div key={exam._id} style={cardStyles}>
                                <h3 style={{ color: '#2C3E50', fontSize: '18px' }}>{exam.title}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                    <div>
                                        <span style={{ color: getDifficultyColor(exam.difficulty), fontWeight: 'bold' }}>{exam.difficulty}</span>
                                        {/* Conditionally render the previous result */}
                                        {exam.completed && exam.bestScore !== null && (
                                            <p style={{ margin: '5px 0 0', color: '#607D8B' }}>
                                                Last Score: <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>{exam.bestScore}%</span>
                                            </p>
                                        )}
                                    </div>
                                    <Link 
                                        to={`/mock-exam/${subjectId}/exams/${exam._id}`} 
                                        style={startExamLinkStyles}
                                    >
                                        Start Exam
                                    </Link>
                                </div>
                            </div>
                        )) : <p style={{ color: '#607D8B' }}>No exams found for this subject.</p>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubjectExams;