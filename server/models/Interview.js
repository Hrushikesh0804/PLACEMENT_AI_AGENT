const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // This links the interview to a specific user
  },
});

module.exports = mongoose.model('interview', InterviewSchema);
