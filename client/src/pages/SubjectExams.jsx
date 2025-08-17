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

    // Corrected: Updated keys to match the database and the new MockExam.jsx
    const subjectNames = { 
        'OOP': 'Object-Oriented Programming', 
        'CN': 'Computer Networks', 
        'DBMS': 'Database Management', 
        'DSA': 'Data Structures & Algorithms', 
        'OS': 'Operating Systems' 
    };
    const subjectColors = { 
        'OOP': '#64FFDA', 
        'CN': '#ff6b6b', 
        'DBMS': '#4ecdc4', 
        'DSA': '#45b7d1', 
        'OS': '#f9ca24' 
    };
    const getDifficultyColor = (difficulty) => ({ Easy: '#4CAF50', Medium: '#FF9800', Hard: '#F44336' }[difficulty] || '#64FFDA');

    const pageLayoutStyles = { display: 'flex', minHeight: '100vh', backgroundColor: '#0a192f' };
    const mainContentStyles = { flex: 1, padding: '20px', backgroundColor: '#0a192f' };
    const cardGridStyles = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' };
    const cardStyles = { backgroundColor: '#112240', padding: '25px', borderRadius: '12px', border: '1px solid #233554' };

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
        return <div style={{ backgroundColor: '#0A192F', height: '100vh', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    return (
        <div style={pageLayoutStyles}>
            <Sidebar user={user} onLogout={onLogout} />
            <main style={mainContentStyles}>
                <div>
                    <div style={{ marginBottom: '30px' }}>
                        <Link to="/mock-exam" style={{ color: '#64FFDA', textDecoration: 'none' }}>← Back to Subjects</Link>
                        <h1 style={{ color: '#E6F1FF' }}>{subjectNames[subjectId]} Exams</h1>
                    </div>
                    <div style={cardGridStyles}>
                        {exams.length > 0 ? exams.map((exam) => (
                            <div key={exam._id} style={cardStyles}>
                                <h3 style={{ color: subjectColors[subjectId], fontSize: '18px' }}>{exam.title}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                    <span style={{ color: getDifficultyColor(exam.difficulty), fontWeight: 'bold' }}>{exam.difficulty}</span>
                                    <Link to={`/exam/${exam._id}`} style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '5px', color: '#0A192F', backgroundColor: subjectColors[subjectId], fontWeight: 'bold' }}>
                                        Start Exam
                                    </Link>
                                </div>
                            </div>
                        )) : <p style={{ color: '#a8b2d1' }}>No exams found for this subject.</p>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubjectExams;