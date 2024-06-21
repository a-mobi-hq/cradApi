const express = require('express');
const { createPitchDeck, getPitchDeckById, deleteHub, updatePitchDeckById } = require('../controllers/HubController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', AuthRoutes.verifyTokenUser, createPitchDeck);
console.log('pitch')
router.get('/:id', AuthRoutes.verifyTokenUser, getPitchDeckById);
router.put('/:id', AuthRoutes.verifyTokenUser, updatePitchDeckById);
router.delete('/:id', AuthRoutes.verifyTokenUser, deleteHub);

module.exports = router;