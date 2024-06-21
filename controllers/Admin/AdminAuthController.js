// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminUserModel = require('../../models/Admin/AdminUserModel');

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by email
    const user = await AdminUserModel.findOne({
      $or: [
        { email: username }, // Check if the username matches an email
        { phoneNumber: username }, // Check if the username matches a phoneNumber
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, permission:user.adminUserRole}, process.env.ADMIN_ACCESS_TOKEN_SECRET);

    res.json({ status: 200, message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  loginAdmin,
};
