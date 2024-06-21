// models/Transfer.js

const mongoose = require('mongoose');

const TransferSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  amount: String,
  ref_key: String,
  transStatus: String,
  companyId: String,
  created_date: String,
});

const Transfer = mongoose.model('Transfer', TransferSchema);

module.exports = Transfer;