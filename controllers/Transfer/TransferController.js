// controllers/TransferController.js

const Transfer = require('../../models/Transfer/TransferModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createTransfer = async (req, res) => {
  try {
    // Validate input using Joi
    const schema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      amount: Joi.string().required(),
      ref_key: Joi.string().required(),
      transStatus: Joi.string().required(),
      companyId: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

   

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(req.body);
    const { fullName, email, phoneNumber, amount,ref_key,transStatus,companyId} = req.body;

    // Check if phone number is exactly 11 characters
    if (phoneNumber.length < 11) {
      return res.status(400).json({ status: 400, error: 'Incorrect phone number length' });
    }

    if (phoneNumber.length > 13) {
      return res.status(400).json({ error: 'Incorrect phone number length' });
    }

    if (fullName.length < 1) {
      return res.status(400).json({ error: 'Please fill in Full Name' });
    }

    if (amount.length < 3) {
      return res.status(400).json({ error: 'Please fill in Amount' });
    }

    if (fullName.ref_key < 3) {
      return res.status(400).json({ error: 'Please fill in Ref Key' });
    }

    if (fullName.transStatus < 3) {
      return res.status(400).json({ error: 'Please fill in Transfer Status' });
    }

    if (fullName.companyId < 3) {
      return res.status(400).json({ error: 'Please select Comapany' });
    }

    // Check if email is in proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Incorrect email format' });
    }


    const newTransfer = new Transfer({
      fullName,
      email,
      phoneNumber,
      amount, 
      ref_key,
      transStatus,
      companyId,
    });
    await newTransfer.save();
    const access_token = jwt.sign({ TransferId: newTransfer._id }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ status: 200, message: 'Success',data:{ Transfer: newTransfer, access_token }});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find();
    res.json(transfers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTransferById = async (req, res) => {
  try {
    const TransferId = req.params.id; // Assuming the Transfer ID is part of the URL parameters

    // Find the Transfer by ID in the database
    const transfer = await Transfer.findById(TransferId);

    // Check if the Transfer exists
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    // Return the Transfer data in the response
    res.json(transfer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateTransfer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input using Joi
    const schema = Joi.object({
      transStatus: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const transfer = await Transfer.findById(id);
    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    
    const { transStatus} = req.body;

    if (transStatus.length < 3) {
      return res.status(400).json({ status: 400, error: 'Incorrect Status' });
    }


   
    
    const updatedTransfer = await Transfer.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTransfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    //res.json(updatedTransfer);

    transfer.transStatus = transStatus;
    await transferStatus.save();

    res.json({ status: 200, message: 'Status Updated successfully',Transfer:updatedTransfer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



module.exports = {
  createTransfer,
  getTransfers,
  getTransferById,
  updateTransfer,
};
