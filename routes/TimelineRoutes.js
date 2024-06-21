const express = require('express');
const { addNewTimeline,updateTimeline,addUsersToTimeline,getTimelinesByProject,deleteTimelineById,createUpload } = require('../controllers/TimelineController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();


router.post('/', AuthRoutes.verifyTokenUser, addNewTimeline);
router.post('/upload', AuthRoutes.verifyTokenUser, createUpload);
router.put('/:id',AuthRoutes.verifyTokenUser, updateTimeline);
router.patch('/:id/users',AuthRoutes.verifyTokenUser,addUsersToTimeline);
router.get('/projects/:id/', AuthRoutes.verifyTokenUser, getTimelinesByProject);
router.delete('/:id',AuthRoutes.verifyTokenUser, deleteTimelineById);

module.exports = router;
