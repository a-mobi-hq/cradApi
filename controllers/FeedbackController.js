// controllers/UserController.js

const Share = require('../models/FeedbackModel');
const User = require('../models/UserModel');
const Team = require('../models/TeamModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Feedback = require('../models/FeedbackModel');


const createFeed = async (req, res) => {
  try {

    console.log("feed");
    console.log(req.body);
   

  
    

    const { projectId, phase, userId,summary} = req.body;
    console.log()
    console.log(req.body);
    const newFeed = new Feedback({
      projectId,
      phase,
      userId,
      feedback:summary,
    });
    await newFeed.save();
    res.json({ status: 200, message: 'Success',data:{ feed: newFeed }});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getFeeedbackByProjectId = async (req, res) => {
  try {
    const { id } = req.params;
    const Shares = await Feedback.find({ projectId: id }).populate('userId', 'firstName'); // Select only name and email fields from user

    res.json({ status: 200, data: Shares });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getUserShareByProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const Shares = await Share.find({ projectId:id});
    console.log(Shares);
    res.json({ status: 200, data: Shares });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


  const generatePassword = () => {
    const length = 8;
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)];

    const passwordChars = [
      getRandomChar(uppercase),
      getRandomChar(lowercase),
      getRandomChar(numbers),
      getRandomChar(specialChars)
    ];

    const allChars = uppercase + lowercase + numbers + specialChars;
    for (let i = passwordChars.length; i < length; i++) {
      passwordChars.push(getRandomChar(allChars));
    }

    for (let i = passwordChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
    }

    return passwordChars.join('');

    
  };

const getPhaseByShare = async (req, res) => {
  try {
    const shareId = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const share = await Share.findById(shareId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user data in the response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};









const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
 createFeed,
 getFeeedbackByProjectId,
};
