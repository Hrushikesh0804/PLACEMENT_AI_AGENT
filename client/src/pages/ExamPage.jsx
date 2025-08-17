import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExamPage = () => {
    const { subjectId, examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showResults, setShowResults] = useState(false); // New state to control result display
    const [examResults, setExamResults] = useState(null); // New state to store results

    // API base URL
    const API_BASE_URL = 'http://localhost:5000';

    // --- Enhanced Styles ---
    const pageLayoutStyles = {
        minHeight: '100vh',
        backgroundColor: '#F0F4F8',
        padding: '30px',
        color: '#2C3E50',
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
    };
    const containerStyles = { maxWidth: '800px', margin: '0 auto' };
    const headerStyles = {
        backgroundColor: '#FFFFFF',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    };
    const questionCardStyles = {
        backgroundColor: '#FFFFFF',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        marginBottom: '20px'
    };
    const progressCardStyles = {
        backgroundColor: '#FFFFFF',
        padding: '15px',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };
    const buttonGroupStyles = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
    const navigationButtonStyles = {
        padding: '12px 24px',
        backgroundColor: '#4FC3F7',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'background-color 0.2s'
    };
    const disabledButtonStyles = {
        ...navigationButtonStyles,
        backgroundColor: '#CFD8DC',
        color: '#90A4AE',
        cursor: 'not-allowed'
    };
    const submitButtonStyles = {
        ...navigationButtonStyles,
        backgroundColor: '#E57373',
    };
    const resultContainerStyles = {
        backgroundColor: '#FFFFFF',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #E0E0E0',
    };
    const scoreStyles = {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#4CAF50',
        margin: '20px 0',
    };
    const resultsListStyles = {
        marginTop: '20px',
        textAlign: 'left',
    };

    const handleSubmitExam = useCallback(async () => {
        if (submitting) return;
        setSubmitting(true);
        const endTime = Date.now();
        const timeTaken = Math.round((endTime - startTime) / 1000); // Time in seconds
        
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const response = await axios.post(
                `${API_BASE_URL}/api/mock-exam/subjects/${subjectId}/exams/${examId}/submit`,
                { answers: selectedAnswers, timeTaken }, // Pass timeTaken to backend
                config
            );
            
            // Set results to state and show results view
            setExamResults(response.data);
            setShowResults(true);
            
        } catch (error) {
            console.error('Error submitting exam:', error);
            // Fallback logic for client-side calculation if backend fails
            let score = 0;
            questions.forEach((q, index) => {
                if (selectedAnswers[index] === q.correctAnswerIndex) score++;
            });
            const percentage = Math.round((score / questions.length) * 100);
            setExamResults({ score, totalQuestions: questions.length, percentage });
            setShowResults(true);

        } finally {
            setSubmitting(false);
        }
    }, [startTime, questions, selectedAnswers, subjectId, examId, submitting, API_BASE_URL]);

    useEffect(() => {
        const loadExam = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found, redirecting to login');
                navigate('/login');
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const config = { headers: { 'x-auth-token': token }, timeout: 10000 };
                console.log('🎯 Fetching exam with subject ID:', subjectId, 'and exam ID:', examId);
                const res = await axios.get(`${API_BASE_URL}/api/mock-exam/subjects/${subjectId}/exams/${examId}`, config);
                console.log('✅ Exam data received:', res.data);
                
                const examDetails = {
                    title: res.data.exam?.title || `${subjectId} Exam`,
                    duration: res.data.exam?.duration || 90,
                };
                const examQuestions = res.data.questions || [];

                if (examQuestions.length === 0) {
                    throw new Error('No questions found for this exam');
                }

                setExam(examDetails);
                setQuestions(examQuestions);
                setTimeLeft(examDetails.duration * 60);
                setStartTime(Date.now());
                console.log(`✅ Loaded exam: ${examDetails.title} with ${examQuestions.length} questions`);
            } catch (error) {
                console.error('❌ Error loading exam:', error);
                if (error.response?.status === 401) {
                    console.log('Authentication failed, clearing token and redirecting to login');
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                } else if (error.response?.status === 404) {
                    setError('Exam not found or no questions available');
                } else if (error.code === 'ECONNABORTED') {
                    setError('Request timed out. Please check your connection.');
                } else if (error.response?.status === 400) {
                    setError('Invalid exam ID');
                } else {
                    setError(error.response?.data?.message || 'Failed to load exam. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };
        if (examId && subjectId) {
            loadExam();
        } else {
            setError('No exam or subject ID provided');
            setLoading(false);
        }
    }, [examId, subjectId, navigate, API_BASE_URL]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmitExam();
            return;
        }
        if (!timeLeft || timeLeft < 0) return;
        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, handleSubmitExam]);

    const handleAnswerSelect = (optionIndex) => {
        setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: '#F0F4F8', height: '100vh', color: '#2C3E50', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading Exam...</div>
                <div style={{ fontSize: '14px', color: '#4FC3F7' }}>Exam ID: {examId}</div>
                <div style={{ fontSize: '12px', color: '#607D8B', marginTop: '10px' }}>Please wait while we prepare your exam</div>
            </div>
        );
    
}

if (error) {
    return (
        <div style={{ backgroundColor: '#F0F4F8', height: '100vh', color: '#2C3E50', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
            <div style={{ color: '#F44336', marginBottom: '20px', textAlign: 'center', fontSize: '18px' }}>❌ {error}</div>
            <button onClick={() => navigate('/mock-exam')} style={{ padding: '12px 24px', backgroundColor: '#4FC3F7', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Back to Mock Exams</button>
        </div>
    );
}

// Display results screen if showResults is true
if (showResults) {
    return (
        <div style={pageLayoutStyles}>
            <div style={containerStyles}>
                <div style={resultContainerStyles}>
                    <h2 style={{ color: '#2C3E50', fontSize: '2rem' }}>Exam Results</h2>
                    <p style={{ color: '#607D8B' }}>You have completed the {exam?.title || 'Exam'}.</p>
                    <div style={scoreStyles}>{examResults?.score}/{examResults?.totalQuestions}</div>
                    <p style={{ fontSize: '1.5rem', color: '#4CAF50' }}>{examResults?.percentage}%</p>
                    <button onClick={() => navigate(`/mock-exam/${subjectId}`)} style={{ padding: '12px 24px', backgroundColor: '#4FC3F7', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>Back to Exams</button>
                </div>
            </div>
        </div>
    );
}

if (!exam || !questions.length) {
    return (
        <div style={{ backgroundColor: '#F0F4F8', height: '100vh', color: '#2C3E50', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ color: '#F44336', marginBottom: '20px', fontSize: '18px' }}>No exam data available</div>
            <button onClick={() => navigate('/mock-exam')} style={{ padding: '12px 24px', backgroundColor: '#4FC3F7', color: '#FFFFFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Back to Mock Exams</button>
        </div>
    );
}

const currentQuestion = questions[currentQuestionIndex];

return (
    <div style={pageLayoutStyles}>
        <div style={containerStyles}>
            {/* Header */}
            <div style={headerStyles}>
                <h2 style={{ margin: 0, fontSize: '24px' }}>{exam.title}</h2>
                <div style={{ color: timeLeft < 300 ? '#F44336' : '#4CAF50', fontWeight: 'bold', fontSize: '18px' }}>⏰ {formatTime(timeLeft)}</div>
            </div>
            {/* Question Progress */}
            <div style={progressCardStyles}>
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>Answered: {Object.keys(selectedAnswers).length}/{questions.length}</span>
            </div>
            {/* Question */}
            <div style={questionCardStyles}>
                <h3 style={{ marginBottom: '25px', fontSize: '20px', lineHeight: '1.5' }}>{currentQuestion?.questionText}</h3>
                <div>
                    {currentQuestion?.options?.map((option, index) => (
                        <div key={index} style={{ margin: '15px 0', padding: '15px', border: selectedAnswers[currentQuestionIndex] === index ? '2px solid #4FC3F7' : '1px solid #E0E0E0', borderRadius: '8px', backgroundColor: selectedAnswers[currentQuestionIndex] === index ? '#E1F5FE' : 'transparent', color: selectedAnswers[currentQuestionIndex] === index ? '#0288D1' : '#2C3E50', cursor: 'pointer', transition: 'all 0.2s ease' }} onClick={() => handleAnswerSelect(index)}>
                            <label style={{ display: 'block', cursor: 'pointer', fontSize: '16px' }}>
                                <input type="radio" name="answer" checked={selectedAnswers[currentQuestionIndex] === index} onChange={() => handleAnswerSelect(index)} style={{ marginRight: '12px' }} />
                                {option}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            {/* Navigation */}
            <div style={buttonGroupStyles}>
                <button onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))} disabled={currentQuestionIndex === 0} style={currentQuestionIndex === 0 ? disabledButtonStyles : navigationButtonStyles}>← Previous</button>
                {currentQuestionIndex === questions.length - 1 ? (
                    <button onClick={handleSubmitExam} disabled={submitting} style={submitting ? disabledButtonStyles : submitButtonStyles}>{submitting ? '⏳ Submitting...' : '✓ Submit Exam'}</button>
                ) : (
                    <button onClick={() => setCurrentQuestionIndex(i => Math.min(questions.length - 1, i + 1))} style={navigationButtonStyles}>Next →</button>
                )}
            </div>
        </div>
    </div>
);
};
export default ExamPage; 