// controllers/AdminUserController.js

const AdminUser = require('../../models/Admin/AdminUserModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createAdminUser = async (req, res) => {
  try {
    // Validate input using Joi
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      password: Joi.string().required(),
      adminUserRole: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

   

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(req.body);
    const { firstName, lastName, email, phoneNumber, password,adminUserRole} = req.body;

    // Check if phone number is exactly 11 characters
    if (phoneNumber.length < 11) {
      return res.status(400).json({ status: 400, error: 'Incorrect phone number length' });
    }

    if (phoneNumber.length > 13) {
      return res.status(400).json({ error: 'Incorrect phone number length' });
    }

    if (adminUserRole.length < 1) {
      return res.status(400).json({ error: 'Please fill in Admin Role' });
    }

    // Check if email is in proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Incorrect email format' });
    }

    // Check if first name and last name are not more than 20 characters
    if (firstName.length > 20 || lastName.length > 20) {
      return res.status(400).json({ error: 'First name or last name too long' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'Invalid password format' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdminUser = new AdminUser({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      adminUserRole
    });
    await newAdminUser.save();
    const access_token = jwt.sign({ AdminUserId: newAdminUser._id, permission: adminUserRole}, process.env.ADMIN_ACCESS_TOKEN_SECRET);
    res.json({ status: 200, message: 'Success',data:{ AdminUser: newAdminUser, access_token }});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const AdminUsers = await AdminUser.find();
    res.json(AdminUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAdminUserById = async (req, res) => {
  try {
    const AdminUserId = req.params.id; // Assuming the AdminUser ID is part of the URL parameters

    // Find the AdminUser by ID in the database
    const adminUser = await AdminUser.findById(AdminUserId);

    // Check if the AdminUser exists
    if (!adminUser) {
      return res.status(404).json({ error: 'AdminUser not found' });
    }

    // Return the AdminUser data in the response
    res.json(adminUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateAdminUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input using Joi
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      adminUserRole: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, lastName, email, phoneNumber,companyPosition} = req.body;

    if (phoneNumber.length < 11) {
      return res.status(400).json({ status: 400, error: 'Incorrect phone number length' });
    }

    if (phoneNumber.length > 13) {
      return res.status(400).json({ error: 'Incorrect phone number length' });
    }

    // Check if email is in proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Incorrect email format' });
    }

    // Check if first name and last name are not more than 20 characters
    if (firstName.length > 20 || lastName.length > 20) {
      return res.status(400).json({ error: 'First name or last name too long' });
    }
    
    
    const updatedAdminUser = await AdminUser.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAdminUser) {
      return res.status(404).json({ error: 'AdminUser not found' });
    }

    //res.json(updatedAdminUser);
    res.json({ status: 200, message: 'Profile changed successfully',AdminUser:updatedAdminUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate input using Joi
    const schema = Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().required(),
      confirmNewPassword: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Authenticate the AdminUser using their current credentials
    const adminUser = await AdminUser.findById(id);

    if (!adminUser) {
      return res.status(404).json({ error: 'Admin User not found' });
    }



    const isPasswordValid = await bcrypt.compare(currentPassword, adminUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Validate new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the AdminUser's password in the database
    adminUser.password = hashedNewPassword;
    await adminUser.save();

    res.json({ status: 200, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAdminUser = await AdminUser.findByIdAndDelete(id);

    if (!deletedAdminUser) {
      return res.status(404).json({ error: 'AdminUser not found' });
    }

    res.json(deletedAdminUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
  createAdminUser,
  getAdminUsers,
  getAdminUserById,
  updateAdminUser,
  changePassword,
  deleteAdminUser,
};
