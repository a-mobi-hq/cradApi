const Kpi = require('../models/KpiModel'); // Import the Mongoose model
const Joi = require('joi');
// Controller method to handle POST requests for saving graph data

const saveGraphData = async (req, res) => {
    try {
        // Extract data from the request body sent by React
       
        const { Axix, userId, projectId, kpiGraphType, kpiGraphName } = req.body;
        console.log(Axix);
        // Filter out years with empty months
        //const filteredYears = years.filter(year => year.months.length > 0);

        if (!projectId) {
            return res.status(400).json({ error: 'Project is required' });
          }

          if (!kpiGraphType) {
            return res.status(400).json({ error: 'Graph is required' });
          }

          if (!kpiGraphName) {
            return res.status(400).json({ error: 'Graph Name is required' });
            
          }
          

           const existingGraph = await Kpi.findOne({ projectId, kpiGraphName, kpiGraphType });

          if (existingGraph) {
            return res.status(400).json({ error: 'Graph Name is already used' });
          }

        // Create a new graph entry document using the filtered data
        const newKpi = new Kpi({
            userId,
            projectId,
            kpiGraphType,
            kpiGraphName,
            axis: Axix.map(({ x, y }) => ({ x, y })),
        });

        // Save the new graph entry document to the database
        await newKpi.save();

        // Respond with a success message
        res.status(201).json({ message: 'Kpi data saved successfully', graph: newKpi });
    } catch (error) {
       
        // If an error occurs, respond with an error message
        console.error('Error saving graph data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const saveGraphDataUpdate = async (req, res) => {
    try {
        // Extract data from the request body sent by React
       
        const { Axix, userId, projectId, kpiGraphType, kpiGraphName,id } = req.body;
        console.log(Axix);
        // Filter out years with empty months
        //const filteredYears = years.filter(year => year.months.length > 0);

        if (!projectId) {
            return res.status(400).json({ error: 'Project is required' });
          }

          if (!kpiGraphType) {
            return res.status(400).json({ error: 'Graph is required' });
          }

          if (!kpiGraphName) {
            return res.status(400).json({ error: 'Graph Name is required' });
            
          }

          const deletedGraph = await Kpi.findByIdAndDelete(id);

          //const existingGraph = await GraphEntry.findOne({ projectId, graphName, graphType });

        // if (existingGraph) {
        //   return res.status(400).json({ error: 'Graph Name is already used' });
        // }

        if (!deletedGraph) {
          return res.status(404).json({ error: 'Graph not found' });
        }

          

        //    const existingGraph = await Kpi.findOne({ projectId, kpiGraphName, kpiGraphType });

        //   if (existingGraph) {
        //     return res.status(400).json({ error: 'Graph Name is already used' });
        //   }

        // Create a new graph entry document using the filtered data
        const newKpi = new Kpi({
            userId,
            projectId,
            kpiGraphType,
            kpiGraphName,
            axis: Axix.map(({ x, y }) => ({ x, y })),
        });

        // Save the new graph entry document to the database
        await newKpi.save();

        // Respond with a success message
        res.status(201).json({ message: 'Kpi data saved successfully', graph: newKpi });
    } catch (error) {
       
        // If an error occurs, respond with an error message
        console.error('Error saving graph data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getGraphData = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("kpi get");
        console.log(id);

        // Query the database to find graph entries matching projectId and graphType
        const graphEntries = await Kpi.findById(id);

        console.log(graphEntries);

        // Respond with the fetched graph data
        //res.status(200).json(graphEntries);
        res.json({ status: 200, message: 'Profile changed successfully',kpi:graphEntries });
    } catch (error) {
        // If an error occurs, respond with an error message
        console.error('Error fetching kpi data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getKpiByProjectId = async (req, res) => {
  try {
    const id = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const kpi = await Kpi.find({projectId : id});

    // Check if the user exists
    if (!kpi) {
      return res.status(404).json({ error: 'not found' });
    }

    // Return the user data in the response
    res.json({ status: 200, message: 'Gotten',data:kpi });
    //res.json(scrap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteKpiById = async (req, res) => {
  const { id } = req.params;
  try {
      // Find and delete all graph entries with the given name
      await Kpi.findByIdAndDelete(id);
      res.status(200).json({ message: ` Kpi deleted successfully` });
  } catch (error) {
      console.error('Error deleting graphs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
    saveGraphData,getGraphData,saveGraphDataUpdate,getKpiByProjectId,deleteKpiById
  };
