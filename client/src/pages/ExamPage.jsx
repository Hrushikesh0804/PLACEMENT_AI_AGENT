import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExamPage = () => {
  const { examId } = useParams();
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

  // API base URL - adjust if needed
  const API_BASE_URL = 'http://localhost:5000';

  // Wrap handleSubmitExam in useCallback to memoize it
  const handleSubmitExam = useCallback(async () => {
    if (submitting) return; // Prevent double submission
    
    setSubmitting(true);
    const endTime = Date.now();
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };
      
      // Submit to backend for processing
      const response = await axios.post(
        `${API_BASE_URL}/api/exams/${examId}/submit`,
        {
          answers: selectedAnswers,
          startTime,
          endTime
        },
        config
      );
      
      const { score, totalQuestions, percentage, timeTaken } = response.data;
      
      // Show results
      alert(`Exam Completed! 🎉\n\nScore: ${score}/${totalQuestions} (${percentage}%)\nTime Taken: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`);
      
      console.log("Full Results:", response.data);
      
      // Navigate back to mock exam page
      navigate('/mock-exam');
      
    } catch (error) {
      console.error('Error submitting exam:', error);
      
      // Fallback: calculate results on frontend if backend fails
      const timeTaken = Math.round((endTime - startTime) / 1000);
      let score = 0;
      const results = questions.map((q, index) => {
        const isCorrect = selectedAnswers[index] === q.correctAnswerIndex;
        if (isCorrect) score++;
        return {
          question: q.questionText,
          selected: q.options[selectedAnswers[index]] || 'Not answered',
          correct: q.options[q.correctAnswerIndex],
          isCorrect: isCorrect,
        };
      });
      
      alert(`Exam Completed! 🎉\n\nScore: ${score}/${questions.length}\nTime Taken: ${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`);
      console.log("Exam Results:", results);
      navigate('/mock-exam');
    } finally {
      setSubmitting(false);
    }
  }, [startTime, questions, selectedAnswers, navigate, examId, submitting, API_BASE_URL]);

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
        
        const config = { 
          headers: { 'x-auth-token': token },
          timeout: 10000 // 10 second timeout
        };

        console.log('🎯 Fetching exam with ID:', examId);
        console.log('🔑 Using token:', token ? 'Present' : 'Missing');
        
        const res = await axios.get(`${API_BASE_URL}/api/exams/${examId}`, config);
        console.log('✅ Exam data received:', res.data);

        if (!res.data.exam) {
          throw new Error('Invalid exam data received');
        }

        setExam(res.data.exam);
        
        const examQuestions = res.data.questions || [];
        
        if (examQuestions.length === 0) {
          throw new Error('No questions found for this exam');
        }
        
        setQuestions(examQuestions);
        setTimeLeft(res.data.exam.duration * 60); // Convert minutes to seconds
        setStartTime(Date.now());
        
        console.log(`✅ Loaded exam: ${res.data.exam.title} with ${examQuestions.length} questions`);
        
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

    if (examId) {
      loadExam();
    } else {
      setError('No exam ID provided');
      setLoading(false);
    }
  }, [examId, navigate, API_BASE_URL]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmitExam();
      return;
    }
    
    if (!timeLeft || timeLeft < 0) return;
    
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          return 0; // This will trigger handleSubmitExam in the next render
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [timeLeft, handleSubmitExam]);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers(prev => ({ 
      ...prev, 
      [currentQuestionIndex]: optionIndex 
    }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        backgroundColor: '#0A192F', 
        height: '100vh', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading Exam...</div>
        <div style={{ fontSize: '14px', color: '#64FFDA' }}>
          Exam ID: {examId}
        </div>
        <div style={{ fontSize: '12px', color: '#8892b0', marginTop: '10px' }}>
          Please wait while we prepare your exam
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{
        backgroundColor: '#0A192F', 
        height: '100vh', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ color: '#ff6b6b', marginBottom: '20px', textAlign: 'center', fontSize: '18px' }}>
          ❌ {error}
        </div>
        <button 
          onClick={() => navigate('/mock-exam')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#64FFDA',
            color: '#0A192F',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Back to Mock Exams
        </button>
      </div>
    );
  }

  // Check if we have valid data
  if (!exam || !questions.length) {
    return (
      <div style={{
        backgroundColor: '#0A192F', 
        height: '100vh', 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center'
      }}>
        <div style={{ color: '#ff6b6b', marginBottom: '20px', fontSize: '18px' }}>
          No exam data available
        </div>
        <button 
          onClick={() => navigate('/mock-exam')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#64FFDA',
            color: '#0A192F',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Back to Mock Exams
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a192f', padding: '20px', color: '#E6F1FF' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: '#112240', 
          padding: '20px', 
          borderRadius: '12px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>{exam.title}</h2>
          <div style={{ 
            color: timeLeft < 300 ? '#ff6b6b' : '#64FFDA', 
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            ⏰ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question Progress */}
        <div style={{
          backgroundColor: '#112240',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>Answered: {Object.keys(selectedAnswers).length}/{questions.length}</span>
        </div>

        {/* Question */}
        <div style={{ 
          backgroundColor: '#112240', 
          padding: '30px', 
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '25px', fontSize: '20px', lineHeight: '1.5' }}>
            {currentQuestion?.questionText}
          </h3>
          
          <div>
            {currentQuestion?.options?.map((option, index) => (
              <div 
                key={index} 
                style={{ 
                  margin: '15px 0', 
                  padding: '15px', 
                  border: selectedAnswers[currentQuestionIndex] === index 
                    ? '2px solid #64FFDA' 
                    : '1px solid #233554', 
                  borderRadius: '8px',
                  backgroundColor: selectedAnswers[currentQuestionIndex] === index 
                    ? 'rgba(100, 255, 218, 0.1)' 
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleAnswerSelect(index)}
              >
                <label style={{ display: 'block', cursor: 'pointer', fontSize: '16px' }}>
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedAnswers[currentQuestionIndex] === index}
                    onChange={() => handleAnswerSelect(index)}
                    style={{ marginRight: '12px' }}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <button 
            onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))} 
            disabled={currentQuestionIndex === 0}
            style={{
              padding: '12px 24px',
              backgroundColor: currentQuestionIndex === 0 ? '#233554' : '#64FFDA',
              color: currentQuestionIndex === 0 ? '#8892b0' : '#0A192F',
              border: 'none',
              borderRadius: '8px',
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            ← Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button 
              onClick={handleSubmitExam}
              disabled={submitting}
              style={{
                padding: '12px 24px',
                backgroundColor: submitting ? '#8892b0' : '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              {submitting ? '⏳ Submitting...' : '✓ Submit Exam'}
            </button>
          ) : (
            <button 
              onClick={() => setCurrentQuestionIndex(i => Math.min(questions.length - 1, i + 1))}
              style={{
                padding: '12px 24px',
                backgroundColor: '#64FFDA',
                color: '#0A192F',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;