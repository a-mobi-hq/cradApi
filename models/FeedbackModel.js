// models/Feedback.js

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  projectId: String,
  phase: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  feedback: String,
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model('Feedback', ReviewSchema);

module.exports = Feedback;