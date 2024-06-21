const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  dates: [Date], // Array to store dates of activity
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;