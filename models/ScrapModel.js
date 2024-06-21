const mongoose = require('mongoose');

const scrapSchema = new mongoose.Schema({
    scrap: String,
    projectId: String,
    userId: String,
    scrapName: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});



const Scrap = mongoose.model('scrap', scrapSchema);

module.exports = Scrap;
