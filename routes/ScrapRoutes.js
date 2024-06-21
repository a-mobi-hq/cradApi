// routes/UserRoutes.js

const express = require('express');
const { createScrapName, updateScrap, updateScrapName,getScrapById,getScrapByProject,deleteScrap } = require('../controllers/ScrapController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', createScrapName);
router.get('/:id', getScrapById);
router.delete('/:id', deleteScrap);
router.get('/project/:id', getScrapByProject);
// router.put('/:id', AuthRoutes.verifyTokenUser,updateUser);
router.put('/scrap/:id',AuthRoutes.verifyTokenUser,updateScrap);
router.put('/scrapname/:id',AuthRoutes.verifyTokenUser,updateScrapName);

module.exports = router;
