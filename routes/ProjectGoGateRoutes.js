const express = require('express');
const router = express.Router();
const { getProjectGoGateByProjectId,updateStatus } = require('../controllers/ProjectGoGateController');

// Route to fetch one unanswered question by user ID, question type, and question subtype
router.get('/go/:projectId/:stage/', getProjectGoGateByProjectId);
router.put('/go/status/', updateStatus);

module.exports = router;

