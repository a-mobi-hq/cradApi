const GoGate = require('../models/GoModel');
const Joi = require('joi');
// Controller to create a new GoGate
const createGoGate = async (req, res) => {
  try {

    const schema = Joi.object({
      goGate: Joi.string().required(),
        phase: Joi.string().required(),
        stage: Joi.string().required(),
      });
  
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

    const { goGate, phase,stage } = req.body;

    const newGoGate = new GoGate({
      goGate,
      phase,
      stage
    });

    console.log("saving");
    await newGoGate.save();

    res.status(200).json({ message: 'GoGate created successfully', data: newGoGate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to edit an existing GoGate
const updateGoGate = async (req, res) => {
  try {
    const { id } = req.params;
    const { goGate, detail, gateStatus, } = req.body;

    const updatedGoGate = await GoGate.findByIdAndUpdate(id, {
      goGate,
      detail,
      gateStatus,
    }, { new: true });

    if (!updatedGoGate) {
      return res.status(404).json({ error: 'GoGate not found' });
    }

    res.status(200).json({ message: 'GoGate updated successfully', data: updatedGoGate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to delete a GoGate
const deleteGoGate = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGoGate = await GoGate.findByIdAndDelete(id);

    if (!deletedGoGate) {
      return res.status(404).json({ error: 'GoGate not found' });
    }

    res.status(200).json({ message: 'GoGate deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller to get all GoGates
const getAllGoGates = async (req, res) => {
  try {
    const allGoGates = await GoGate.find();
    res.status(200).json({ data: allGoGates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get a single GoGate by its ID
const getSingleGoGate = async (req, res) => {
  try {
    const { id } = req.params;
    const goGate = await GoGate.findById(id);
    if (!goGate) {
      return res.status(404).json({ error: 'GoGate not found' });
    }
    res.status(200).json({ data: goGate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllGoGatesByProjectId = async (req, res) => {
    try {
      const { projectId } = req.params;
  
      // Find all GoGates with the specified project ID
      const allGoGates = await GoGate.find({ projectId });
  
      res.status(200).json({ data: allGoGates });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const getAllGatesByStageAndProjectId = async (req, res) => {
    try {
      const { stage, projectId } = req.params;
  
      // Find all projects with the specified stage and project ID
      const allProjects = await GoGate.find({ stage, projectId });
  
      res.status(200).json({ data: allProjects });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

// Controller to update gate status
const updateGateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { gateStatus } = req.body;

    const updatedGoGate = await GoGate.findByIdAndUpdate(id, { gateStatus }, { new: true });

    if (!updatedGoGate) {
      return res.status(404).json({ error: 'GoGate not found' });
    }

    res.status(200).json({ message: 'Gate status updated successfully', data: updatedGoGate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createGoGate, updateGoGate, deleteGoGate, updateGateStatus,getAllGoGates, getSingleGoGate,getAllGoGatesByProjectId,getAllGatesByStageAndProjectId };
