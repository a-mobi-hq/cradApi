const Joi = require('joi');
const ProjectGoGate = require('../models/ProjectGoGateModel'); // Import the Project model


const getProjectGoGateByProjectId = async (req, res) => {
    try {

        const { projectId, stage } = req.params;
        // Find all ProjectGoGate entries with the specified projectId
        const projectGoGates = await ProjectGoGate.find({ projectId, stage });

        console.log('ProjectGoGates:', projectGoGates);
        res.json({ status: 200, data: projectGoGates });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateStatus = async (req, res) => {
    const { gateId,newStatus } = req.body;

    console.log(newStatus);


    try {
        // Find the ProjectGoGate entry to update by gateId
        let projectGoGate = await ProjectGoGate.findById(gateId);
        // Check if the ProjectGoGate entry exists

        console.log(projectGoGate);
        if (!projectGoGate) {
            return res.status(404).json({ error: 'ProjectGoGate not found' });
        }

        // Update the status
        projectGoGate.goStatus = newStatus;

        // Save the updated ProjectGoGate entry
        await projectGoGate.save();
        

        res.json({ message: 'Status updated successfully', projectGoGate });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { 
    getProjectGoGateByProjectId,
    updateStatus
};
