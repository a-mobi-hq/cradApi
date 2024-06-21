// routes/UserRoutes.js

const express = require('express');
const { createUser, getUsers, getUserById,updateUser, deleteUser, changePasswordCustomer } = require('../../controllers/UserController');
const AuthRoutes = require('../../authMiddleware');
const router = express.Router();

router.post('/customer/', AuthRoutes.verifyTokenAdmin,createUser);
router.get('/customer/', AuthRoutes.verifyTokenAdmin,getUsers);
router.get('/customer/:id', AuthRoutes.verifyTokenAdmin,getUserById);
router.put('/customer/:id', AuthRoutes.verifyTokenAdmin,updateUser);
router.put('/customer/change-password/:id',AuthRoutes.verifyTokenAdmin,changePasswordCustomer);
router.delete('/customer/:id',AuthRoutes.verifyTokenAdmin, deleteUser);

module.exports = router;
