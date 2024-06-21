const express = require('express');
const router = express.Router();
const {saveGraphData,getGraphData,saveGraphDataUpdate,getKpiByProjectId,deleteKpiById} = require('../controllers/KpiController');

// Define route for saving graph data
router.post('/', saveGraphData);
router.get('/:id', getGraphData);
router.delete('/:id', deleteKpiById);
router.get('/project/:id', getKpiByProjectId);
router.post('/update', saveGraphDataUpdate);

module.exports = router;
