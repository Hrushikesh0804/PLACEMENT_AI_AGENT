const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: true,
  },
});

module.exports = mongoose.model('exam', ExamSchema);
