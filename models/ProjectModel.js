// models/User.js

const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: String,
  projectName: String,
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;