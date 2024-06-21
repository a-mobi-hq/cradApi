// routes/UserRoutes.js

const express = require('express');
const { createAdminUser, getAdminUsers, getAdminUserById,updateAdminUser, deleteAdminUser, changePassword } = require('../../controllers/Admin/AdminController');
const AuthRoutes = require('../../authMiddleware');
const router = express.Router();

router.post('/',createAdminUser);
router.get('/',  AuthRoutes.verifyTokenAdmin,getAdminUsers);
router.get('/:id',  AuthRoutes.verifyTokenAdmin,getAdminUserById);
router.put('/:id', AuthRoutes.verifyTokenAdmin,updateAdminUser);
router.put('/change-password/:id',AuthRoutes.verifyTokenAdmin,changePassword);
router.delete('/:id',AuthRoutes.verifyTokenAdmin, deleteAdminUser);

module.exports = router;
