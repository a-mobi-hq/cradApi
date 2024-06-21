// routes/UserRoutes.js
const express = require('express');
const { createAnswer, getAllAnswersByUser,updateAnswer, deleteAnswer,getAnswersByCriteria } = require('../controllers/AnswerController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser,createAnswer);
router.get('/:id', AuthRoutes.verifyTokenUser,getAllAnswersByUser);
router.put('/:id', AuthRoutes.verifyTokenUser,updateAnswer);
router.delete('/:id', AuthRoutes.verifyTokenUser,deleteAnswer);
router.get('/:projectId/:questionType/:questionSubType', AuthRoutes.verifyTokenUser,getAnswersByCriteria);
module.exports = router;
