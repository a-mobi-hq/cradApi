// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const algoController = require('../controllers/algorithms');

// POST /api/auth/login

router.post('/qcount/:userId/:questionType/:projectId', algoController.countTotalQuestionsAnsweredByTypeAndProject);
router.post('/qcountq/:questionType', algoController.getTotalQuestionsByType);

module.exports = router;
