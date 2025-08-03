import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ExamPage = () => {
  const { subjectId, examId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes in seconds
  const [loading, setLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);

  const subjectNames = {
    'oops': 'Object-Oriented Programming',
    'cn': 'Computer Networks',
    'dbms': 'Database Management Systems',
    'dsa': 'Data Structures & Algorithms',
    'os': 'Operating Systems'
  };

  useEffect(() => {
    loadQuestions();
  }, [subjectId, examId]);

  useEffect(() => {
    let timer;
    if (examStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const loadQuestions = async () => {
    try {
      // Load questions from cs_mcqs.json
      const response = await fetch('/server/data/cs_mcqs.json');
      const data = await response.json();
      
      // Get subject questions and select 30 for this exam
      const subjectQuestions = data[subjectId] || [];
      const examQuestions = subjectQuestions.slice((examId - 1) * 30, examId * 30);
      
      setQuestions(examQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      // Fallback sample questions
      setQuestions(generateSampleQuestions());
    } finally {
      setLoading(false);
    }
  };

  const generateSampleQuestions = () => {
    // Sample questions structure
    return Array.from({ length: 30 }, (_, index) => ({
      id: index + 1,
      question: `Sample question ${index + 1} for ${subjectNames[subjectId]}?`,
      options: [
        `Option A for question ${index + 1}`,
        `Option B for question ${index + 1}`,
        `Option C for question ${index + 1}`,
        `Option D for question ${index + 1}`
      ],
      correctAnswer: Math.floor(Math.random() * 4),
      explanation: `This is the explanation for question ${index + 1}`
    }));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    // Calculate score
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    
    // Navigate to results page or back to subject
    alert(`Exam completed! Your score: ${score}/${questions.length}`);
    navigate(`/mock-exam/${subjectId}`);
  };

  const startExam = () => {
    setExamStarted(true);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a192f', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: '#E6F1FF', fontSize: '18px' }}>Loading exam...</div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0a192f', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#112240',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #233554',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h1 style={{ color: '#E6F1FF', marginBottom: '20px' }}>
            {subjectNames[subjectId]} - Exam {examId}
          </h1>
          <div style={{ color: '#a8b2d1', marginBottom: '30px', lineHeight: '1.6' }}>
            <p>• Duration: 90 minutes</p>
            <p>• Total Questions: 30</p>
            <p>• Each question carries equal marks</p>
            <p>• You can navigate between questions</p>
            <p>• Exam will auto-submit after time expires</p>
          </div>
          <button
            onClick={startExam}
            style={{
              backgroundColor: '#64FFDA',
              color: '#112240',
              padding: '15px 30px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(selectedAnswers).length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a192f', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: '#112240',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #233554',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ color: '#E6F1FF', margin: 0 }}>
              {subjectNames[subjectId]} - Exam {examId}
            </h2>
            <p style={{ color: '#a8b2d1', margin: '5px 0 0 0' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: timeLeft < 300 ? '#ff6b6b' : '#64FFDA', fontSize: '24px', fontWeight: 'bold' }}>
              {formatTime(timeLeft)}
            </div>
            <div style={{ color: '#a8b2d1', fontSize: '12px' }}>
              Answered: {answeredQuestions}/{questions.length}
            </div>
          </div>
        </div>

        {/* Question */}
        <div style={{
          backgroundColor: '#112240',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid #233554',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#E6F1FF', fontSize: '18px', marginBottom: '25px', lineHeight: '1.6' }}>
            {currentQuestion?.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {currentQuestion?.options.map((option, index) => (
              <label
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  backgroundColor: selectedAnswers[currentQuestionIndex] === index ? '#1e3a5f' : 'transparent',
                  border: selectedAnswers[currentQuestionIndex] === index ? '1px solid #64FFDA' : '1px solid #233554',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedAnswers[currentQuestionIndex] !== index) {
                    e.target.style.backgroundColor = '#1a2332';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswers[currentQuestionIndex] !== index) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <input
                  type="radio"
                  name="answer"
                  checked={selectedAnswers[currentQuestionIndex] === index}
                  onChange={() => handleAnswerSelect(index)}
                  style={{ marginRight: '15px' }}
                />
                <span style={{ color: '#E6F1FF', fontSize: '14px' }}>
                  {String.fromCharCode(65 + index)}. {option}
                </span>
              </label>
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
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            style={{
              backgroundColor: currentQuestionIndex === 0 ? '#233554' : '#64FFDA',
              color: currentQuestionIndex === 0 ? '#666' : '#112240',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleSubmitExam}
              style={{
                backgroundColor: '#ff6b6b',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Submit Exam
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              style={{
                backgroundColor: currentQuestionIndex === questions.length - 1 ? '#233554' : '#64FFDA',
                color: currentQuestionIndex === questions.length - 1 ? '#666' : '#112240',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;