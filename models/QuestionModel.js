const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionType: String,
    questionSubType: String,
    question: String,
    questionOrder:String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
