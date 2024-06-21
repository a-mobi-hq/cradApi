// routes/UserRoutes.js
const express = require('express');
const { createTask, getAllTaskByUser, updateTask, deleteTask } = require('../controllers/TaskController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser, createTask);
console.log("task")
// router.get('/:id', AuthRoutes.verifyTokenUser, getAllTaskByUser);
// router.put('/:id', AuthRoutes.verifyTokenUser, updateTask);
// router.delete('/:id', AuthRoutes.verifyTokenUser,deleteTask);
module.exports = router;

