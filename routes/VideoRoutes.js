// routes/UserRoutes.js

const express = require('express');
const {createVideo, getVideos, getVideoById,updateVideo, deleteVideo } = require('../controllers/VideoController');
const AuthRoutes = require('../authMiddleware');
const router = express.Router();

router.post('/', createVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.put('/:id',updateVideo);
router.delete('/:id',deleteVideo);

module.exports = router;
