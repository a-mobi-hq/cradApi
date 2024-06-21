// models/PitchDeck.js

const mongoose = require('mongoose');


const pitchDeckSchema = new mongoose.Schema({
  projectId: String, 
  documentName: String,
  document: String,
  documetType: String,
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const PitchDeck = mongoose.model('pitchDeck', pitchDeckSchema);

module.exports = PitchDeck;