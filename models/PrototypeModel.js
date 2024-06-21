// models/Prototype.js

const mongoose = require('mongoose');


const prototypeSchema = new mongoose.Schema({
  projectId: String, 
  imageName: String,
  sequence: String,
  image: String,
  prototypeType: String,
  prototypeSubtype: String,
  timeSent: {
    type: Date,
    default: Date.now
  }
});

const Prototype = mongoose.model('prototype', prototypeSchema);

module.exports = Prototype;