const GraphEntry = require('../models/GraphModel'); // Import the Mongoose model
const Joi = require('joi');
// Controller method to handle POST requests for saving graph data

const saveGraphData = async (req, res) => {
    try {
        // Extract data from the request body sent by React
       
        const { years, userId, projectId, graphType, graphName } = req.body;

        // Filter out years with empty months
        const filteredYears = years.filter(year => year.months.length > 0);

        if (!projectId) {
            return res.status(400).json({ error: 'Project is required' });
          }

          if (!graphType) {
            return res.status(400).json({ error: 'Graph is required' });
          }

          if (!graphName) {
            return res.status(400).json({ error: 'Graph Name is required' });
            
          }
          

           const existingGraph = await GraphEntry.findOne({ projectId, graphName, graphType });

          if (existingGraph) {
            return res.status(400).json({ error: 'Graph Name is already used' });
          }

        // Create a new graph entry document using the filtered data
        const newGraphEntry = new GraphEntry({
            userId,
            projectId,
            graphType,
            graphName,
            years: filteredYears
        });

        // Save the new graph entry document to the database
        await newGraphEntry.save();

        // Respond with a success message
        res.status(201).json({ message: 'Graph data saved successfully', graph: newGraphEntry });
    } catch (error) {
       
        // If an error occurs, respond with an error message
        console.error('Error saving graph data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const getGraphData = async (req, res) => {
    try {
        const { projectId, graphType } = req.query;

        // Query the database to find graph entries matching projectId and graphType
        const graphEntries = await GraphEntry.find({ projectId, graphType }).populate('userId', 'firstName');
        // Respond with the fetched graph data
        res.status(200).json(graphEntries);
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error fetching graph data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateGraph = async (req, res) => {
  try {
      // Extract data from the request body sent by React
     


      const { years, userId, projectId, graphType, graphName ,id} = req.body;
      console.log(id);

     

      // Filter out years with empty months
      const filteredYears = years.filter(year => year.months.length > 0);

      if (!projectId) {
          return res.status(400).json({ error: 'Project is required' });
        }

        if (!graphType) {
          return res.status(400).json({ error: 'Graph is required' });
        }

        if (!graphName) {
          return res.status(400).json({ error: 'Graph Name is required' });
          
        }
        
        const deletedGraph = await GraphEntry.findByIdAndDelete(id);

          //const existingGraph = await GraphEntry.findOne({ projectId, graphName, graphType });

        // if (existingGraph) {
        //   return res.status(400).json({ error: 'Graph Name is already used' });
        // }

        if (!deletedGraph) {
          return res.status(404).json({ error: 'Graph not found' });
        }

      // Create a new graph entry document using the filtered data
      const newGraphEntry = new GraphEntry({
          userId,
          projectId,
          graphType,
          graphName,
          years: filteredYears
      });

      // Save the new graph entry document to the database
      await newGraphEntry.save();

      // Respond with a success message
      res.status(201).json({ message: 'Graph data saved successfully', graph: newGraphEntry });
  } catch (error) {
     
      // If an error occurs, respond with an error message
      console.error('Error saving graph data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getGraphDataById = async (req, res) => {
  try {
      const { id } = req.params;

      console.log(id);

      // Query the database to find graph entries matching projectId and graphType
      const graphEntries = await GraphEntry.findById({ _id:id });

      // Respond with the fetched graph data
      res.status(200).json(graphEntries);
  } catch (error) {
      // If an error occurs, respond with an error message
      console.error('Error fetching graph data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};
const deleteGraph = async (req, res) => {
    const { id } = req.params;
    try {
        // Find and delete all graph entries with the given name
        await GraphEntry.findByIdAndDelete(id);
        res.status(200).json({ message: ` Graph deleted successfully` });
    } catch (error) {
        console.error('Error deleting graphs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };
module.exports = {
    saveGraphData,getGraphData,deleteGraph,getGraphDataById,updateGraph
  };
