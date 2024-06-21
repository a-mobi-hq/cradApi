const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
    projectId: String,
    email: String,
    phases: { type: [String], required: true },
    userId: String,
    link: String,
    ShareUserId: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const Share = mongoose.model('share', shareSchema);

module.exports = Share;
