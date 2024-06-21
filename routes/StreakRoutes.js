// routes/UserRoutes.js

const express = require('express');
const router = express.Router();
const { recordActivity } = require('../controllers/StreakController'); 

console.log("streak");
router.post('/',recordActivity);


module.exports = router;
