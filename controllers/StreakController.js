const mongoose = require('mongoose');
const UserActivity = require('../models/StreakModel'); // Adjust the path as needed

// Function to record activity and update streak
const recordActivity = async (req, res) => {
    try {
      console.log("streak control");
      const { userId, projectId } = req.body;
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to 00:00:00 for date comparison
  
      // Find user activity record for the specific project
      let userActivity = await UserActivity.findOne({ userId, projectId });
  
      if (!userActivity) {
        // If no record exists, create a new one
        userActivity = new UserActivity({ userId, projectId, dates: [today] });
      } else {
        // Check if the user has already performed the activity today
        const lastDate = new Date(userActivity.dates[userActivity.dates.length - 1]);
        lastDate.setHours(0, 0, 0, 0);
  
        if (lastDate.getTime() === today.getTime()) {
          return res.status(200).json({ message: 'Activity already recorded for today', streak: userActivity.dates.length });
        }
  
        // Check if the last activity was yesterday
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
  
        if (lastDate.getTime() === yesterday.getTime()) {
          // Continue the streak
          userActivity.dates.push(today);
        } else {
          // Reset the streak
          userActivity.dates = [today];
        }
      }
  
      // Save the updated activity record
      await userActivity.save();
  
      res.status(200).json({ message: 'Activity recorded', streak: userActivity.dates.length });
    } catch (error) {
      console.error('Error recording activity:', error);
      res.status(500).json({ error: 'Could not record activity' });
    }
  };

module.exports = { recordActivity };
