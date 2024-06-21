const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
   videoType: String,
   videoSubType: String,
   videoLink: String,
   videoOrder: String,
   videoTime: String,
    timeSent: {
        type: Date,
        default: Date.now
      }
});



const Video = mongoose.model('video', videoSchema);

module.exports = Video;
