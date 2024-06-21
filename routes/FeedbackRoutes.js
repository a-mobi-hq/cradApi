const express = require('express');
const { createFeed,getFeeedbackByProjectId } = require('../controllers/FeedbackController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser,createFeed);
router.get('/:id', AuthRoutes.verifyTokenUser,getFeeedbackByProjectId);

module.exports = router;
