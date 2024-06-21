const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
    phase: String,
    projectId: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    task: String,
    startDate: String,
    endDate: String,
    color: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const Timeline = mongoose.model('timeline', timelineSchema);

module.exports = Timeline;
