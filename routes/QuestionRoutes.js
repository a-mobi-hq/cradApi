// routes/UserRoutes.js

const express = require('express');
const { createQuestion,getQuestionById } = require('../controllers/QuestionController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', createQuestion);
router.get('/:id', AuthRoutes.verifyTokenUser, getQuestionById);

module.exports = router;
