const express = require('express');
const router = express.Router();
const {saveGraphData,getGraphData,deleteGraph,getGraphDataById,updateGraph} = require('../controllers/GraphController');

// Define route for saving graph data
router.post('/graph', saveGraphData);
router.get('/graph', getGraphData);
router.get('/graph/single/:id', getGraphDataById);
router.post('/graph/update', updateGraph);
router.delete('/graph/:id', deleteGraph);

module.exports = router;
