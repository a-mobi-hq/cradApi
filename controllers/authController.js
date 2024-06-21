// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const UserModel = require('../models/UserModel');

const login = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Validate input using Joi
      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
      });
  
      const { error } = schema.validate(req.body);
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
  
      //const user = await User.findOne({ email });
      const user = await UserModel.findOne({
        $or: [
          { email: username }, // Check if the email matches
          { phoneNumber: username }, // Check if the phoneNumber matches (replace yourPhoneNumber with the actual value)
        ],
      });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid Password' });
      }
  
      // Validate new password and confirm password match
      const access_token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
  
      res.json({ status: 200, message: 'Login successfully', token: access_token, user: user});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

module.exports = {
  login,
};
