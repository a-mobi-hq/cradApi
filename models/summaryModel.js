const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
    summary: String,
    projectId: String,
    questionType: String,
    questionSubType: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});



const Summary = mongoose.model('summary', summarySchema);

module.exports = Summary;
