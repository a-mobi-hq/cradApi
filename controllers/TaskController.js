const Task = require('../models/TaskModel'); // Import the Mongoose model
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Controller method to handle POST requests for saving graph data

const createTask = async (req, res) => {
    try {
        // Extract data from the request body sent by React
       
        const { projectId, task, color, startDate, endDate} = req.body;

        console.log(req.body)
        console.log('taskcontroll')
        // Filter out years with empty months
        // const filteredYears = years.filter(year => year.months.length > 0);

        console.log(req.body);

          if (!task) {
            return res.status(400).json({ error: 'task is required' });
          }

          if (!color) {
            return res.status(400).json({ error: 'color Description is required' });
            
          }

          if (!startDate) {
            return res.status(400).json({ error: 'startDate is required' });
            
          }

          if (!endDate) {
            return res.status(400).json({ error: 'endDate is required' });
            
          }


        // Create a new graph entry document using the filtered data
        const newTask = new Task({
            projectId,
            task,
            color,
            startDate,
            endDate, 
        });

        // Save the new graph entry document to the database
        await newTask.save();

        // Respond with a success message
        res.status(201).json({ message: 'Graph data saved successfully', task: newTask });
    } catch (error) {
       
        // If an error occurs, respond with an error message
        console.error('Error saving graph data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = {
    createTask,
  };

