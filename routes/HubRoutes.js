const express = require('express');
const router = express.Router();
const {getHubs,getTypes, getTypeDetails,getSubtypeFiles,getHubsByProjectId,getAllFilesByTimelineId} = require('../controllers/HubController');

// Define route for saving graph data
router.get('/', getHubs);
router.get('/types/:projectId', getTypes);
router.get('/files/:timelineId', getAllFilesByTimelineId);
router.get('/project/:projectId', getHubsByProjectId);
router.get('/types/:type', getTypeDetails);
router.get('/types/:type/:subtype', getSubtypeFiles);

module.exports = router;
