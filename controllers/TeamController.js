// controllers/UserController.js

const Team = require('../models/TeamModel');
const User = require('../models/UserModel');
const Project = require('../models/ProjectModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const createTeam = async (req, res) => {
  try {
    // Validate input using Joi
    const schema = Joi.object({
      projectId: Joi.string().required(),
      link: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);


    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { projectId, link, email} = req.body;
    


    // Check if email is in proper format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Incorrect email format' });
    }
    

    
    const newTeam = new Team({
      projectId,
      email,
      link,
    });
    //console.log(newTeam);
    await newTeam.save();
    
    res.json({ status: 200, message: 'Success'});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
    try {
        const { username, password,link } = req.body;
    
        // Validate input using Joi
        const schema = Joi.object({
          link: Joi.string().required(),
          username: Joi.string().required(),
          password: Joi.string().required()
        });
    
        const { error } = schema.validate(req.body);
    
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }

        let userId = "";
        //const user = await User.findOne({ email });
        const user = await User.findOne({
          $or: [
            { email: username }, // Check if the email matches
            { phoneNumber: username }, // Check if the phoneNumber matches (replace yourPhoneNumber with the actual value)
          ],
        });
    
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }else{
             userId = user._id;
        }
    
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid Password' });
        }

       

      const shareIndex = link.indexOf('/login');

      const shareUpwards = link.slice(shareIndex);
      console.log(shareUpwards);
      const existingUserLink = await Team.findOne({ link:shareUpwards });
      if (existingUserLink) {
        
         console.log('Existing User');
      } else {
        
        return res.status(400).json({ error: 'Not Found' });
      }

     
      existingUserLink.userId = userId;
      existingUserLink.teamRole = "Team Member";
     await existingUserLink.save();


      
    
        // Validate new password and confirm password match
        const access_token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
    
        res.json({ status: 200, message: 'Login successfully', token: access_token, user: user});
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const signup = async (req, res) => {
    try {
      // Validate input using Joi
      const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().required(),
        password: Joi.string().required(),
        cpassword: Joi.string().required(),
        link: Joi.string().required(),
      });
  
      const { error } = schema.validate(req.body);
  
  
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      const { firstName, lastName, email, phoneNumber, password,link} = req.body;
      
      // Check if phone number is exactly 11 characters
      if (phoneNumber.length < 11) {
        return res.status(400).json({ status: 400, error: 'Incorrect phone number length' });
      }
  
      if (phoneNumber.length > 13) {
        return res.status(400).json({
          error: 'Incorrect phone number length'
        });
      }
  
      console.log("here");
      console.log(password);
  
      // Check if email is in proper format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Incorrect email format' });
      }
      
  
      // Check if first name and last name are not more than 20 characters
      if (firstName.length > 20 || lastName.length > 20) {
        return res.status(400).json({ error: 'First name or last name too long' });
      }
  
  
      const existingUserEmail = await User.findOne({ email });
      if (existingUserEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      const existingUserPhone = await User.findOne({ phoneNumber });
      if (existingUserPhone) {
        return res.status(400).json({ error: 'Phone Number already exists' });
      }
      
  
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
      console.log(password)
      if (!passwordRegex.test(password)) {
        return res.status(400).json({ error: 'Invalid password format' });
      }


      const shareIndex = link.indexOf('/login');

      const shareUpwards = link.slice(shareIndex);
      console.log(shareUpwards);
      const existingUserLink = await Team.findOne({ link:shareUpwards });

      if (existingUserLink) {
         
        console.log('Existing User');
        
      } else {
        
        return res.status(400).json({ error: 'Not Found' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
        const newUser = new User({
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashedPassword, // Save the hashed password
          // Add other properties as needed
        });
        console.log(newUser);
        await newUser.save();

        existingUserLink.userId = newUser._id;
        existingUserLink.teamRole = "Team Member";
        await existingUserLink.save();

        const access_token = jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ status: 200, message: 'Success',data:{ user: newUser, access_token }});
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  const getTeamMembersByProjectId = async (req, res) => {
    try {
        const projectId = req.params.id;

        console.log(req.params.id);
        console.log(projectId);

        if (!projectId) {
            return res.status(400).json({ error: 'No Project' });
        }
      const teamMembers = await Team.find({ projectId });
  
      if (teamMembers.length === 0) {
        return {
          status: 'error',
          message: 'No team members found for the given project ID',
        };
      }
  
      const teamMembersWithUserDetails = await Promise.all(teamMembers.map(async (member) => {
        const user = await User.findOne({ _id: member.userId });
        const userDetails = user ? { firstName: user.firstName, lastName: user.lastName } : { firstName: '', lastName: '' };
        return { ...member.toObject(), userDetails };
      }));

      res.status(200).json({
        status: 'success',
        data: teamMembersWithUserDetails,
      });
  
     
    } catch (error) {
      console.error('Error fetching team members:', error);
      return {
        status: 'error',
        message: 'Internal Server Error',
      };
    }
  };

  const getTeamProjectsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;

        console.log(req.params.id);
        console.log(userId);

        if (!userId) {
            return res.status(400).json({ error: 'No User' });
        }
      const teamMembers = await Team.find({ userId });
  
      if (teamMembers.length === 0) {
        return {
          status: 'error',
          message: 'No Projects Found',
        };
      }
  
      const teamMembersWithUserDetails = await Promise.all(teamMembers.map(async (member) => {
        const project = await Project.findOne({ _id: member.projectId });
        const projectDetails = project ? { project: project.projectName} : { projectName: '' };
        return { ...member.toObject(), projectDetails };
      }));

      res.status(200).json({
        status: 'success',
        data: teamMembersWithUserDetails,
      });
  
     
    } catch (error) {
      console.error('Error fetching team members:', error);
      return {
        status: 'error',
        message: 'Internal Server Error',
      };
    }
  };
  
  
const getTeamById = async (req, res) => {
  try {
    const projectId = req.params.id; // Assuming the user ID is part of the URL parameters

    // Find the user by ID in the database
    const tean = await Team.findById(projectId);

    // Check if the user exists
    if (!tean) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Return the user data in the response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate input using Joi
    const schema = Joi.object({
      userId: Joi.string().required(),
      link: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { userId, lastName, email, phoneNumber} = req.body;

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
    
    
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    //res.json(updatedUser);
    res.json({ status: 200, message: 'Profile changed successfully',user:updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    //console.log(req.params);
    console.log("here");
    const { id } = req.params;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate input using Joi
    // const schema = Joi.object({
    //   currentPassword: Joi.string().required(),
    //   newPassword: Joi.string().required(),
    //   confirmNewPassword: Joi.string().required(),
    // });

    // const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Authenticate the user using their current credentials
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }



    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Validate new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.json({ status: 200, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    //console.log(req.params);
    console.log("here");
    const { id } = req.params;
    const { status } = req.body;

    console.log(status);

    

    // Authenticate the user using their current credentials
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.status = status;
    await user.save();

    res.json({ status: 200, message: 'Status Changed Successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const changePasswordCustomer = async (req, res) => {
  try {
    
    const { id } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    // Validate input using Joi
    const schema = Joi.object({
      newPassword: Joi.string().required(),
      confirmNewPassword: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Authenticate the user using their current credentials
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    // Validate new password and confirm password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: 'New passwords do not match' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    user.password = hashedNewPassword;
    await user.save();

    res.json({ status: 200, message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await Team.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(deletedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const handleImageUpload = async (req, res) => {
  try {
    console.log("controller");
    console.log(req);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const image = req.files.image;

    const imagePath = `${Date.now()}-${image.name}`;
    console.log('Destination path:', imagePath);
    image.mv(imagePath);

    // Do something with the image data, such as saving it to a directory or database
    // Example: image.mv('/path/to/save/image.jpg');

    res.status(200).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createTeam,
  getTeamById,
  login,
  signup,
  getTeamMembersByProjectId,
  getTeamProjectsByUserId,
  deleteTeamMember,
};
