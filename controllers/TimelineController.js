const Timeline = require('../models/TimelineModel');
const Project = require('../models/ProjectModel');
const User = require('../models/UserModel');

// Add a new timeline with multiple users
async function addNewTimeline(req, res) {
  try {
    const { phase, projectId, users, task, startDate, endDate, color } = req.body;
    const userIds = users.map(user => user.value);

    const newTimeline = new Timeline({
      phase,
      projectId,
      users:userIds,
      task,
      startDate,
      endDate,
      color
    });
    console.log(newTimeline);
    console.log(userIds);
    await newTimeline.save();
    res.status(200).json({ message: 'Timeline created successfully', timeline: newTimeline });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update a timeline
async function updateTimeline(req, res) {
  try {
    const { id } = req.params;
    const { phase, task, startDate, endDate, color } = req.body;
    const updatedTimeline = await Timeline.findByIdAndUpdate(
      id,
      { phase, task, startDate, endDate, color },
      { new: true }
    );
    if (!updatedTimeline) {
      return res.status(404).json({ message: 'Timeline not found' });
    }
    res.status(200).json({ message: 'Timeline updated successfully', timeline: updatedTimeline });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Add more users to a timeline
async function addUsersToTimeline(req, res) {
  try {
    const { id } = req.params;
    const { userIds } = req.body;
    const timeline = await Timeline.findById(id);
    if (!timeline) {
      return res.status(404).json({ message: 'Timeline not found' });
    }
    timeline.userIds = [...new Set([...timeline.userIds, ...userIds])]; // Ensure no duplicate users
    await timeline.save();
    res.status(200).json({ message: 'Users added successfully', timeline });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all timelines by project
const getTimelinesByProject = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      console.log("rtimeline");
      console.log(userId);
      console.log(id);
  
      // Fetch the project to check the userId
      const project = await Project.findById(id);
  
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
  
      let timelines;
  
      // Check if the userId matches the project's userId
      if (project.userId === userId) {
        // Fetch all timelines for the project
        timelines = await Timeline.find({ projectId:id }).populate('users', 'firstName');
      } else {
        // Fetch timelines for the specific user within the project
        timelines = await Timeline.find({ projectId:id, userIds: userId }).populate('users', 'firstName');
      }
  
      res.status(200).json(timelines);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
// Delete a timeline by ID
async function deleteTimelineById(req, res) {
  try {
    const { id } = req.params;
    const deletedTimeline = await Timeline.findByIdAndDelete(id);
    if (!deletedTimeline) {
      return res.status(404).json({ message: 'Timeline not found' });
    }
    res.status(200).json({ message: 'Timeline deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const createUpload = async (req, res) => {
    try {
      const userId = req.user.userId;
      console.log(req.body);
  
      // Check for validation errors
      // const errors = validationResult(req);
      // if (!errors.isEmpty()) {
      //   return res.status(400).json({ errors: errors.array() });
      // }
  
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded' });
      }
  
      const { imageName, sequence, type, subtype, projectId } = req.body;
  
      if (!imageName) {
        return res.status(400).json({ error: 'Image Name Required' });
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
        hubType: type,
        hubSubType: subtype,
        userId,
      });
  
      await newPrototype.save();
  
      res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
      console.log('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


module.exports = {
  addNewTimeline,
  updateTimeline,
  addUsersToTimeline,
  getTimelinesByProject,
  deleteTimelineById,
  createUpload
};
