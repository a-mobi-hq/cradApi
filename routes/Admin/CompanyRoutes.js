// routes/CompanyRoutes.js

const express = require('express');
const { createCompany, updateCompany, getCompanies, deleteCompany, getCompanyById } = require('../../controllers/CompanyController');
const router = express.Router();
const AuthRoutes = require('../../authMiddleware');

router.post('/company', createCompany);
router.get('/company', AuthRoutes.verifyTokenAdmin,getCompanies);
router.get('/company/:id', AuthRoutes.verifyTokenAdmin,getCompanyById);
router.put('/company/:id', AuthRoutes.verifyTokenAdmin, updateCompany);
router.delete('/company/:id', AuthRoutes.verifyTokenAdmin,deleteCompany);

module.exports = router;
