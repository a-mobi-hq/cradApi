const mongoose = require('mongoose');

const projectGoGateSchema = new mongoose.Schema({
    goGate: String,
    phase: String,
    stage: String,
    projectId: String,
    goStatus: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});

const ProjectGoGate = mongoose.model('projectGoGate', projectGoGateSchema);

module.exports = ProjectGoGate;
