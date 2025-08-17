// routes/exams.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Import the auth middleware
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const mongoose = require('mongoose'); // Import mongoose to use ObjectId

/**
 * @route GET /api/mock-exam/subjects
 * @desc Get all subjects with exam counts
 * @access Public
 */
router.get('/subjects', async (req, res) => {
    try {
        const subjects = [
            { id: 'OOP', name: 'Object-Oriented Programming (OOPs)' },
            { id: 'CN', name: 'Computer Networks (CN)' },
            { id: 'DBMS', name: 'Database Management Systems (DBMS)' },
            { id: 'DSA', name: 'Data Structures & Algorithms (DSA)' },
            { id: 'OS', name: 'Operating Systems (OS)' }
        ];
        const subjectCounts = await Promise.all(
            subjects.map(async (s) => {
                const count = await Question.countDocuments({ topic: s.id });
                return { ...s, totalQuestions: count };
            })
        );
        res.json(subjectCounts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route GET /api/mock-exam/subjects/:subjectId/exams
 * @desc Get exams for a specific subject from MongoDB
 * @access Private
 */
router.get('/subjects/:subjectId/exams', auth, async (req, res) => {
    try {
        const { subjectId } = req.params;
        const exams = await Exam.find({ topic: subjectId });
        if (exams.length === 0) {
            return res.status(404).json({ error: 'No exams found for this subject' });
        }
        res.json(exams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route GET /api/mock-exam/subjects/:subjectId/exams/:examId
 * @desc Get specific exam questions from MongoDB
 * @access Private
 */
router.get('/subjects/:subjectId/exams/:examId', auth, async (req, res) => {
    try {
        const { examId } = req.params;
        // CRITICAL FIX: Convert string ID to Mongoose ObjectId
        const objectId = new mongoose.Types.ObjectId(examId);
        const questions = await Question.find({ exam: objectId });
        if (questions.length === 0) {
            return res.status(404).json({ error: 'Exam not found or no questions available' });
        }
        const cleaned = questions.map(q => ({
            _id: q._id, questionText: q.questionText, options: q.options
        }));
        res.json({ examId, questions: cleaned, totalQuestions: cleaned.length, duration: 90 });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @route POST /api/mock-exam/subjects/:subjectId/exams/:examId/submit
 * @desc Submit exam and calculate score
 * @access Private
 */
router.post('/subjects/:subjectId/exams/:examId/submit', auth, async (req, res) => {
    try {
        const { examId } = req.params;
        // CRITICAL FIX: Convert string ID to Mongoose ObjectId
        const objectId = new mongoose.Types.ObjectId(examId);
        const { answers } = req.body;
        const examQuestions = await Question.find({ exam: objectId });
        if (!examQuestions || examQuestions.length === 0) {
            return res.status(404).json({ error: 'Exam not found' });
        }
        let correctCount = 0;
        const results = examQuestions.map((q, i) => {
            const userAns = answers[i];
            const correct = userAns === q.correctAnswerIndex;
            if (correct) correctCount++;
            return {
                questionId: q._id,
                userAnswer: userAns,
                correctAnswer: q.correctAnswerIndex,
                isCorrect: correct,
            };
        });
        const percentage = Math.round((correctCount / examQuestions.length) * 100);
        res.json({ score: correctCount, totalQuestions: examQuestions.length, percentage, results });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// In server/routes/exams.js
const ExamResult = require('../models/ExamResult'); // Add this import

// ...

router.post('/subjects/:subjectId/exams/:examId/submit', auth, async (req, res) => {
    try {
        const { examId } = req.params;
        const { answers, timeTaken } = req.body; // You need to send `timeTaken` from the frontend
        
        // ... (existing logic to calculate score and percentage) ...

        const newResult = new ExamResult({
            user: req.user.id, // Comes from the auth middleware
            exam: objectId,
            score,
            totalQuestions: examQuestions.length,
            percentage,
            timeTaken,
        });

        await newResult.save();
        
        res.json({ score, totalQuestions: examQuestions.length, percentage, results });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
