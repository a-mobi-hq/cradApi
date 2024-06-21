// controllers/UserController.js

const Scrap = require('../models/ScrapModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createScrapName = async (req, res) => {
    try {
      // Validate input using Joi
      const schema = Joi.object({
        userId: Joi.string().required(),
        scrapName: Joi.string().required(),
        projectId: Joi.string().required(),
      });
  
      const { error } = schema.validate(req.body);
  
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { userId, scrapName, projectId} = req.body;
      
      
  
     
     
      
      const newScrap = new Scrap({
          userId,
          scrapName,
          projectId,
      });
      console.log(newScrap._id);
      await newScrap.save();
      res.json({ status: 200, message: 'Success',id:newScrap._id,data:{ scrap: newScrap }});
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


const getScrap = async (req, res) => {
  try {
    const Scraps = await Scrap.find();
    res.json(Scraps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getScrapById = async (req, res) => {
  try {
    const id = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const scrap = await Scrap.findById(id);

    // Check if the user exists
    if (!scrap) {
      return res.status(404).json({ error: 'not found' });
    }

    // Return the user data in the response
    
    res.json({ status: 200, message: 'Gotten',data:scrap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getScrapByProject = async (req, res) => {
    try {
      const id = req.params.id; // Assuming the user ID is part of the URL parameters
  
      // Find the user by ID in the database
      const scrap = await Scrap.find({projectId : id});
  
      // Check if the user exists
      if (!scrap) {
        return res.status(404).json({ error: 'not found' });
      }
  
      // Return the user data in the response
      res.json({ status: 200, message: 'Gotten',data:scrap });
      //res.json(scrap);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const updateScrap = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(req.body);

    // Validate input using Joi
    const schema = Joi.object({
      scrap: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    console.log("passed");

    //const { scrapName} = req.body;
    
    const updatedScrap = await Scrap.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedScrap) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log(updatedScrap);

    //res.json(updatedUser);
    res.json({ status: 200, message: 'Scrap updated successfully',user:updatedScrap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateScrapName = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate input using Joi
      const schema = Joi.object({
        scrapName: Joi.string().required(),
      });
  
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      const {scrapName} = req.body;
      
      const updatedScrap = await Scrap.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedScrap) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      //res.json(updatedUser);
      res.json({ status: 200, message: 'Scrap Name updated successfully',user:updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const deleteScrap = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteScrap = await Scrap.findByIdAndDelete(id);

    if (!deleteScrap) {
      return res.status(404).json({ error: 'Scrap not found' });
    }

    res.json(deleteScrap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
    createScrapName,
    getScrap,
    getScrapById,
    getScrapByProject,
    updateScrap,
    updateScrapName,
  deleteScrap,
};
