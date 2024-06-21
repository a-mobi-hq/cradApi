// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/Admin/AdminAuthController');

// POST /api/auth/login
router.post('/', authController.loginAdmin);

module.exports = router;
