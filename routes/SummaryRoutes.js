// routes/UserRoutes.js

const express = require('express');
const { createOrUpdateSummary,getSummaryByProjectIdTypeAndSubType } = require('../controllers/SummaryController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();
console.log("here sum");

router.post('/', AuthRoutes.verifyTokenUser,createOrUpdateSummary);
router.get('/:projectId/:questionType/:questionSubType', AuthRoutes.verifyTokenUser,getSummaryByProjectIdTypeAndSubType);

module.exports = router;
