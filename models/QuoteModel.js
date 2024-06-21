const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
   quoteType: String,
   quote: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});



const Quote = mongoose.model('quote', quoteSchema);

module.exports = Quote;
