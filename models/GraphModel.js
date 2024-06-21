const mongoose = require('mongoose');

// Define the schema for the graph data
const monthSchema = new mongoose.Schema({
    month: String,
    value: String
}, { _id: false });

// Define the schema for the year data
const yearSchema = new mongoose.Schema({
    year: Number,
    months: [monthSchema]
}, { _id: false });

// Define the schema for the main document
const graphEntrySchema = new mongoose.Schema({
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    projectId: {
        type: String,
        required: true
    },
    graphType: {
        type: String,
        required: true
    },
    graphName: {
        type: String,
        required: true
    },
    years: [yearSchema],
    timeSent: {
        type: Date,
        default: Date.now
      }
});

// Create the model for the graph entry
const GraphEntry = mongoose.model('GraphEntry', graphEntrySchema);

module.exports = GraphEntry;
