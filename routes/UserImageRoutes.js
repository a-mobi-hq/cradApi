const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/UploadUserImageController');

// Route for handling image upload
console.log("here upload");
router.post('/upload', uploadController.handleImageUpload);

module.exports = router;