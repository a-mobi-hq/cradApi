const mongoose = require('mongoose');
const Video = require('../models/videoModel'); // Adjust the path as needed

// Create a new video
const createVideo = async (req, res) => {
    console.log("video");
  try {
    const { videoType, videoSubType, videoLink, videoOrder, videoTime } = req.body;

    // Check that each value exists
    if (!videoType || !videoSubType || !videoLink || !videoOrder || !videoTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newVideo = new Video({
      videoType,
      videoSubType,
      videoLink,
      videoOrder,
      videoTime
    });

    await newVideo.save();
    res.status(200).json({ message: 'Video created successfully', video: newVideo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all videos
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single video by ID
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a video by ID
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { videoType, videoSubType, videoLink, videoOrder, videoTime } = req.body;

    // Check that each value exists
    if (!videoType || !videoSubType || !videoLink || !videoOrder || !videoTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { videoType, videoSubType, videoLink, videoOrder, videoTime },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json({ message: 'Video updated successfully', video: updatedVideo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a video by ID
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVideo = await Video.findByIdAndDelete(id);

    if (!deletedVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo
};

