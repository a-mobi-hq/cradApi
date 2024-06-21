// models/AdminUser.js

const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  password: String,
  adminUserRole: String,
});

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

module.exports = AdminUser;