const mongoose = require('mongoose');

const ExamResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Links the result to a specific user
        required: true,
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'exam', // Links the result to a specific exam
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    percentage: {
        type: Number,
        required: true,
    },
    timeTaken: {
        type: Number, // Stored in seconds
    },
    dateAttempted: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('exam_result', ExamResultSchema);