const mongoose = require('mongoose');
const Quote = require('../models/QuoteModel'); // Adjust the path as needed

// Create a new quote
const createQuote = async (req, res) => {
    console.log("quote");
  try {
    const { quoteType, quote} = req.body;

    // Check that each value exists
    if (!quoteType || !quote) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newQuote = new Quote({
      quoteType,
      quote,
    });

    await newQuote.save();
    res.status(200).json({ message: 'Quote created successfully', quote: newQuote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all quotes
const getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find();
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single quote by ID
const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a quote by ID
const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { quoteType, quoteSubType, quoteLink, quoteOrder, quoteTime } = req.body;

    // Check that each value exists
    if (!quoteType || !quoteSubType || !quoteLink || !quoteOrder || !quoteTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { quoteType, quoteSubType, quoteLink, quoteOrder, quoteTime },
      { new: true }
    );

    if (!updatedQuote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.status(200).json({ message: 'Quote updated successfully', quote: updatedQuote });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a quote by ID
const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuote = await Quote.findByIdAndDelete(id);

    if (!deletedQuote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    res.status(200).json({ message: 'Quote deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createQuote,
  getQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote
};

