// routes/UserRoutes.js

const express = require('express');
const {createQuote, getQuotes, getQuoteById,updateQuote, deleteQuote } = require('../controllers/QuoteController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();
console.log("quote");
router.post('/', createQuote);
router.get('/', getQuotes);
router.get('/:id', getQuoteById);
router.put('/:id',updateQuote);
router.delete('/:id',deleteQuote);

module.exports = router;
