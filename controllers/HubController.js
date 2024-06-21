// controllers/UserController.js

const Hub = require('../models/HubModel');
const User = require('../models/UserModel');
const Timeline = require('../models/TimelineModel'); 
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


const createPrototype = async (req, res) => {
  try {
    const userId = req.user.userId;
    const type = "Timeline";
    console.log(req.body);

    // Check for validation errors
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const { imageName, sequence, timelineId, projectId } = req.body;

    if (!imageName) {
      return res.status(400).json({ error: 'Image Name Required' });
    }

    if (!timelineId) {
      return res.status(400).json({ error: 'Task Required' });
    }

    if (!sequence) {
      return res.status(400).json({ error: 'Sequence Required' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Type is Required' });
    }

    const directory = path.join(__dirname, '../public', 'images');

    // Create directory if it doesn't exist
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const image = req.files.image;

    // Check the size of the image (in bytes)
    const imageSizeInBytes = image.data.length;
    const imageSizeInMB = imageSizeInBytes / (1024 * 1024);
    if (imageSizeInMB > 5) {
      return res.status(400).json({ error: 'Image size exceeds the maximum allowed size (5MB)' });
    }

    // Generate a unique filename
    const imagePath = Date.now() + '-' + image.name;
    const destinationPath = path.join(directory, imagePath);

    // Move file to the directory
    image.mv(destinationPath, function(err) {
      if (err) {
        console.error('Error moving file:', err);
        return res.status(500).json({ error: 'Error moving file' });
      } else {
        console.log('File moved successfully to:', destinationPath);
      }
    });

    // Create a new prototype entry
    const newPrototype = new Hub({
      projectId,
      hubFileName: imageName,
      sequence,
      hubFile: imagePath,
      timelineId,
      userId,
    });

    console.log(newPrototype);

    await newPrototype.save();

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.log('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting prototypes by type and subtype
const getPrototypeByTypeAndSubtypeById = async (req, res) => {
  try {
    const { id, type, subtype } = req.params;
    console.log(req.params);
    console.log('my name');
    const prototypes = await Hub.find({ hubType: type, hubSubType: subtype, projectId:id  }).populate('userId', 'firstName');;
    res.json(prototypes);
    console.log(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for getting prototypes by type
const getPrototypeByTypeById = async (req, res) => {
  console.log("pro con")
  try {
    const { id, type } = req.params;
    const prototypes = await Hub.find({ hubType: type, projectId:id }).populate('userId', 'firstName').sort({ sequence: 1 });
    res.json(prototypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const updatePrototypeById = async (req, res) => {
console.log("gwerr");
  try {
    const { id } = req.params;

    console.log( req.params);
    console.log( req.body);

    const {imageName, sequence} = req.body;

    console.log(req.params);
    
    const prototype = await Hub.findById(id);

    if (!prototype) {
      return res.status(404).json({ error: 'Not found' });
    }

    prototype.sequence = sequence;
    prototype.hubFile = imageName;
    await prototype.save();
    //res.json(updatedUser);
    res.json({ status: 200, message: 'Image changed successfully', prototype:prototype });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function createPitchDeck(req, res) {
  try {
    console.log(req.body);
    userId =  req.user.userId;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const { documentName,  projectId} = req.body;

    console.log('projectId '+projectId);

    if (!documentName) {
      return res.status(400).json({ error: 'Image Name Required' });
    }


    console.log(createPitchDeck);

    
    const directory = path.join(__dirname, '../public', 'images');
// 
    // Create directory if it doesn't exist
    if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true });
   }  


    const image = req.files.image;

    console.log(req);

    

     // Check the size of the image (in bytes)
     const imageSizeInBytes = image.data.length;
     console.log('This is the image size in bytes', imageSizeInBytes)
;
     // Convert the size to kilobytes (KB)
     const imageSizeInMB = imageSizeInBytes / ( 1024 * 1024 );
      console.log('This is the image size in mb', imageSizeInMB);
 
     // Check if the image size exceeds the maximum allowed size (100KB)
     if (imageSizeInMB > 5) {
       console.error('Image size exceeds the maximum allowed size (5M)');
       return res.status(400).json({ error: 'Image size exceeds the maximum allowed size (5M)' });
     }
    
    // Move file to the directory
    const imagePath =Date.now()+'-'+image.name;
    

    console.log('Destination path:', imagePath);
    image.mv(path.join(directory, imagePath), function(err) {
      if (err) {
        console.error('Error moving file:', err);
      } else {
        console.log('File moved successfully to:', path.join(directory, imagePath));
      }
    });

    const type = "PitchDeck"; 

    // Create new pitch deck
    const newPitchDeck = await Hub({
      projectId,
      hubFileName:documentName,
      hubFile: imagePath,
      hubType: type,
      userId,
    });
    console.log(newPitchDeck);
    await newPitchDeck.save();
    

    res.status(200).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.log('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function getPitchDeckById(req, res) {
  const deck = "PitchDeck";
  try {
   
    const {id} = req.params;
    //console.log(projectId);
    console.log(id);
    console.log(req.params);
    console.log('projectId '+id);
   
    const pitchDeck = await Hub.find({hubType:deck, projectId:id});
   // const prototypes = await Hub.find({ hubType: type, projectId:id });
    console.log("checking");
    // if (!pitchDeck) {
    //   return res.status(404).json({ message: 'Pitch deck not found' });
    // }
    console.log(pitchDeck);
    console.log(pitchDeck);
    
    res.json(pitchDeck);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Controller function to update a pitch deck by ID
async function updatePitchDeckById(req, res) {
  try {

    const { id } = req.params;

    // Check if required fields are provided
    

    console.log(req.params);
    
    
    const updatedPitchDeck = await Hub.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPitchDeck) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await updatedPitchDeck.save();

  //res.json(updatedUser);
  res.json({ status: 200, message: 'Ducument changed successfully', PitchDeck:updatedPitchDeck });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
}



const getHub = async (req, res) => {
  try {
    const Hub = await Hub.find();
    res.json(Hub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getHubById = async (req, res) => {
  try {
    const hubId = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const hub = await Hub.findById(hubId);

    // Check if the user exists
    if (!hub) {
      return res.status(404).json({ error: 'Not found' });
    }

    // Return the user data in the response
    res.json(hub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





const deleteHub = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHub = await Hub.findByIdAndDelete(id);

    if (!deletedHub) {
      return res.status(404).json({ error: 'Hub not found' });
    }

    res.json(deletedHub);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const organizeHubs = (hubs) => {
  const organized = {};

  hubs.forEach(hub => {
      const { hubType, hubSubType, hubFileName, hubFile } = hub;

      if (!organized[hubType]) {
          organized[hubType] = {
              type: hubType,
              subTypes: {}
          };
      }

      if (hubSubType) {
          if (!organized[hubType].subTypes[hubSubType]) {
              organized[hubType].subTypes[hubSubType] = [];
          }
          organized[hubType].subTypes[hubSubType].push({ hubFileName, hubFile });
      } else {
          if (!organized[hubType].files) {
              organized[hubType].files = [];
          }
          organized[hubType].files.push({ hubFileName, hubFile });
      }
  });

  return organized;
};

const getHubs = async (req, res) => {
  try {
      const hubs = await Hub.find();
      const organizedHubs = organizeHubs(hubs);
      res.status(200).json(organizedHubs);
  } catch (error) {
      console.error('Error fetching hubs:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTypes = async (req, res) => {
  try {
    // Extract projectId from the request parameters or body as needed
    const { projectId } = req.params;

    console.log(projectId);

    // Find documents in the Hub collection based on projectId
    const hubs = await Hub.find({ projectId }).populate('timelineId');

    // Extract distinct timeline names
    const taskMap = new Map();

    // Populate the map with unique tasks
    hubs.forEach(hub => {
      if (hub.timelineId && hub.timelineId.task) {
        taskMap.set(hub.timelineId.task, hub.timelineId._id);
      }
    });

    // Convert the map to an array of objects
    const uniqueTasks = Array.from(taskMap, ([task, timelineId]) => ({ task, timelineId }));


    // Respond with the distinct timeline names
    res.status(200).json(uniqueTasks);
  } catch (error) {
    // Log and respond with internal server error message
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllFilesByTimelineId = async (req, res) => {
  try {
    // Extract timelineId from the request parameters
    const { timelineId } = req.params;

    // Find all documents in the Hub collection based on timelineId
    const files = await Hub.find({ timelineId }).populate('userId');

    // Respond with the files data
    res.status(200).json(files);
  } catch (error) {
    // Log and respond with internal server error message
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getHubsByProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
    const hubs = await Hub.find({ projectId });
    console.log(hubs);
    if (hubs.length === 0) {
      return res.status(404).json({ error: 'No hubs found for the given project ID' });
    }

    res.status(200).json({ data: hubs });
  } catch (error) {
    console.error('Error fetching hubs by project ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getTypeDetails = async (req, res) => {
  const { type } = req.params;

  try {
    // Fetch all hubs of the given type
    const hubs = await Hub.find({ hubType: type });

    // Create an array of promises to fetch user details for each hub
    const hubsWithUserDetailsPromises = hubs.map(async (hub) => {
      const user = await User.findById(hub.userId).select('firstName lastName');
      return {
        ...hub._doc,
        user: user ? { firstName: user.firstName, lastName: user.lastName } : null
      };
    });

    // Resolve all promises to get hubs with user details
    const hubsWithUserDetails = await Promise.all(hubsWithUserDetailsPromises);

    // Separate hubs into subTypes and files
    const subTypes = hubsWithUserDetails.reduce((acc, hub) => {
      if (hub.hubSubType) {
        if (!acc[hub.hubSubType]) {
          acc[hub.hubSubType] = [];
        }
        acc[hub.hubSubType].push(hub);
      }
      return acc;
    }, {});

    const files = hubsWithUserDetails.filter((hub) => !hub.hubSubType);

    // Send the response with subTypes and files including user details
    res.status(200).json({ subTypes, files });
  } catch (error) {
    console.error('Error fetching hubs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getSubtypeFiles = async (req, res) => {
  const { type, subtype } = req.params;
  try {
      const hubs = await Hub.find({ hubType: type, hubSubType: subtype });

      const hubsWithUserDetailsPromises = hubs.map(async (hub) => {
        const user = await User.findById(hub.userId).select('firstName lastName');
        return {
          ...hub._doc,
          user: user ? { firstName: user.firstName, lastName: user.lastName } : null
        };
      });

      const hubsWithUserDetails = await Promise.all(hubsWithUserDetailsPromises);

      res.status(200).json(hubsWithUserDetails);
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createPrototype,
  createPitchDeck,
  getPitchDeckById,
  getPrototypeByTypeById,
  getPrototypeByTypeAndSubtypeById,
  updatePrototypeById,
  updatePitchDeckById,
  getHubById,
  deleteHub,
  getHubs,
  getTypes,
  getTypeDetails,
  getSubtypeFiles,
  getHubsByProjectId,
  getAllFilesByTimelineId
};
