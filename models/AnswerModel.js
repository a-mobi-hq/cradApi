const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    answer: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const Answer = mongoose.model('answer', answerSchema);

module.exports = Answer;
