const express = require('express');
const { createGoGate, updateGoGate, deleteGoGate,updateGateStatus,getAllGatesByStageAndProjectId } = require('../controllers/GoController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser,createGoGate);
router.put('/:id', AuthRoutes.verifyTokenUser,updateGoGate);
router.put('/status/:id', AuthRoutes.verifyTokenUser,updateGateStatus);
router.put('/project/:projectId/stage/:stage', AuthRoutes.verifyTokenUser,getAllGatesByStageAndProjectId);
router.delete('/:id', AuthRoutes.verifyTokenUser,deleteGoGate);

module.exports = router;
