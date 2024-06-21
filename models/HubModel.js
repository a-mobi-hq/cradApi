const mongoose = require('mongoose');

const hubSchema = new mongoose.Schema({
    hubType: String,
    hub: String,
    hubFile: String,
    hubFileName: String,
    hubSubType: String,
    hubUnder: String,
    timelineId: { type: mongoose.Schema.Types.ObjectId, ref: 'timeline' },
    sequence: String,
    projectId: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const hub = mongoose.model('hub', hubSchema);

module.exports = hub;
