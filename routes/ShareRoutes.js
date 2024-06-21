// routes/UserRoutes.js

const express = require('express');
const { createLink, createShareUser, getPhaseByShare,getUserShare ,getUserShareByProject} = require('../controllers/ShareController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser,createLink);
router.post('/user', createShareUser);
router.get('/:id', AuthRoutes.verifyTokenUser,getPhaseByShare);
router.get('/user/:id', AuthRoutes.verifyTokenUser,getUserShare);
router.get('/review/:id/', AuthRoutes.verifyTokenUser,getUserShareByProject);


module.exports = router;
