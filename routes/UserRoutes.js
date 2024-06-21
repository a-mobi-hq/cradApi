// routes/UserRoutes.js

const express = require('express');
const { createUser, getUsers, getUserById,updateUser, deleteUser, changePassword,updateStatus, handleImageUpload } = require('../controllers/UserController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', createUser);
router.get('/:id', getUserById);
router.put('/:id', AuthRoutes.verifyTokenUser,updateUser);
router.put('/change-password/:id',AuthRoutes.verifyTokenUser,changePassword);
router.put('/status/:id',AuthRoutes.verifyTokenUser,updateStatus);
router.put('/upload',handleImageUpload);
router.delete('/:id',AuthRoutes.verifyTokenUser,deleteUser);

module.exports = router;
