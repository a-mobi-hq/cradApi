// routes/CompanyRoutes.js

const express = require('express');
const { createTransfer, updateTransfer, getTransfers, getTransferById } = require('../../controllers/Transfer/TransferController');
const router = express.Router();
const AuthRoutes = require('../../authMiddleware');

router.post('/', AuthRoutes.verifyTokenUser,createTransfer);
router.get('/', AuthRoutes.verifyTokenUser,getTransfers);
router.get('/:id', AuthRoutes.verifyTokenUser,getTransferById);
router.put('/:id', AuthRoutes.verifyTokenUser, updateTransfer);

module.exports = router;
