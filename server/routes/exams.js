// routes/exams.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Load MCQ data once
let mcqData = {};
try {
  const dataPath = path.join(__dirname, '..', 'data', 'cs_mcqs.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  mcqData = JSON.parse(rawData);
  console.log('MCQ data loaded successfully');
} catch (error) {
  console.error('Error loading MCQ data:', error);
}

// Get all subjects
router.get('/subjects', (req, res) => {
  const subjects = [
    { id: 'oops', name: 'Object-Oriented Programming (OOPs)', description: '...', totalQuestions: mcqData.oops?.length || 0 },
    { id: 'cn', name: 'Computer Networks (CN)', description: '...', totalQuestions: mcqData.cn?.length || 0 },
    { id: 'dbms', name: 'Database Management Systems (DBMS)', description: '...', totalQuestions: mcqData.dbms?.length || 0 },
    { id: 'dsa', name: 'Data Structures & Algorithms (DSA)', description: '...', totalQuestions: mcqData.dsa?.length || 0 },
    { id: 'os', name: 'Operating Systems (OS)', description: '...', totalQuestions: mcqData.os?.length || 0 }
  ];
  res.json(subjects);
});

// Get exams for subject
router.get('/subjects/:subjectId/exams', (req, res) => {
  const { subjectId } = req.params;
  if (!mcqData[subjectId]) return res.status(404).json({ error: 'Subject not found' });

  const questions = mcqData[subjectId];
  const total = questions.length;
  const perExam = 30;
  const totalExams = Math.ceil(total / perExam);

  const exams = Array.from({ length: totalExams }, (_, i) => {
    const start = i * perExam;
    const end = Math.min(start + perExam, total);
    return {
      id: i + 1,
      title: getExamTitle(subjectId, i + 1),
      questions: end - start,
      duration: 90,
      difficulty: getDifficulty(i + 1),
      completed: false,
      bestScore: null
    };
  });

  res.json(exams);
});

// Get specific exam questions
router.get('/subjects/:subjectId/exams/:examId', (req, res) => {
  const { subjectId, examId } = req.params;
  const examIndex = parseInt(examId) - 1;
  if (!mcqData[subjectId]) return res.status(404).json({ error: 'Subject not found' });

  const questions = mcqData[subjectId];
  const perExam = 30;
  const start = examIndex * perExam;
  const end = Math.min(start + perExam, questions.length);
  const examQuestions = questions.slice(start, end);

  if (examQuestions.length === 0) return res.status(404).json({ error: 'Exam not found' });

  const cleaned = examQuestions.map(q => ({
    id: q.id, question: q.question, options: q.options, difficulty: q.difficulty
  }));

  res.json({ examId: parseInt(examId), subject: subjectId, questions: cleaned, totalQuestions: cleaned.length, duration: 90 });
});

// Submit exam
router.post('/subjects/:subjectId/exams/:examId/submit', (req, res) => {
  const { subjectId, examId } = req.params;
  const { answers } = req.body;
  const examIndex = parseInt(examId) - 1;

  if (!mcqData[subjectId]) return res.status(404).json({ error: 'Subject not found' });

  const questions = mcqData[subjectId];
  const perExam = 30;
  const start = examIndex * perExam;
  const end = Math.min(start + perExam, questions.length);
  const examQuestions = questions.slice(start, end);

  let correctCount = 0;
  const results = examQuestions.map((q, i) => {
    const userAns = answers[i];
    const correct = userAns === q.correctAnswer;
    if (correct) correctCount++;
    return {
      questionId: q.id, question: q.question, options: q.options,
      userAnswer: userAns, correctAnswer: q.correctAnswer, isCorrect: correct,
      explanation: q.explanation
    };
  });

  const percentage = Math.round((correctCount / examQuestions.length) * 100);
  res.json({ score: correctCount, totalQuestions: examQuestions.length, percentage, results, examId: parseInt(examId), subject: subjectId });
});

// Helper Functions
function getExamTitle(subjectId, examNum) {
  const titles = {
    oops: ['OOP Fundamentals', 'Inheritance & Polymorphism', 'Encapsulation', 'Advanced OOP', 'Design Patterns'],
    cn: ['OSI Model', 'TCP/IP', 'Routing & Switching', 'Security', 'Wireless'],
    dbms: ['ER Model', 'SQL', 'Normalization', 'Transactions', 'Indexing'],
    dsa: ['Arrays', 'Trees', 'Graphs', 'Sorting', 'DP'],
    os: ['Processes', 'Memory', 'File Systems', 'Scheduling', 'Deadlocks']
  };
  return titles[subjectId]?.[examNum - 1] || `Exam ${examNum}`;
}
function getDifficulty(num) {
  return num <= 2 ? 'Easy' : num <= 4 ? 'Medium' : 'Hard';
}

module.exports = router;
