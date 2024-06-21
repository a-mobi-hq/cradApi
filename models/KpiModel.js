const mongoose = require('mongoose');

// Define the schema for the graph data
const valueSchema = new mongoose.Schema({
    x: String,
    y: String,
  });

  


// Define the schema for the main document
const kpiSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    projectId: {
        type: String,
        required: true
    },
    kpiGraphType: {
        type: String,
        required: true
    },
    kpiGraphName: {
        type: String,
        required: true
    },
    axis: [valueSchema],
    timeSent: {
        type: Date,
        default: Date.now
      }
});

// Create the model for the graph entry
const Kpi = mongoose.model('Kpi', kpiSchema);

module.exports = Kpi;
