const express = require('express');
const { createPrototype, getPrototypeByTypeAndSubtypeById, getPrototypeByTypeById, deleteHub, updatePrototypeById } = require('../controllers/HubController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

console.log("pro con prot");
router.post('/', AuthRoutes.verifyTokenUser, createPrototype);
router.get('/type/subtype/:id/:type/:subtype', AuthRoutes.verifyTokenUser, getPrototypeByTypeAndSubtypeById);
router.get('/type/:id/:type', AuthRoutes.verifyTokenUser, getPrototypeByTypeById);
router.put('/:id', AuthRoutes.verifyTokenUser, updatePrototypeById);
router.delete('/:id', AuthRoutes.verifyTokenUser, deleteHub);

module.exports = router;