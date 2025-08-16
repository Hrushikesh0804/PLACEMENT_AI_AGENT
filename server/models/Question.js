const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'exam', // This links the question to a specific exam
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('question', QuestionSchema);
