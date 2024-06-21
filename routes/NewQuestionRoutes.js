const express = require('express');
const router = express.Router();
const { getUnansweredQuestion,getAllAnswersByTypeSubTypeAndProjectId } = require('../controllers/NewQuestionController');

// Route to fetch one unanswered question by user ID, question type, and question subtype
router.get('/question/:userId/:projectId/:questionType/:questionSubType', getUnansweredQuestion);
router.get('/question/:questionType/:questionSubType/:projectId', getAllAnswersByTypeSubTypeAndProjectId);

module.exports = router;

