const Joi = require('joi');
const Prototype = require('../models/PrototypeModel');
const fs = require('fs');
const path = require('path');




// Controller for creating a new prototype
const createPrototype = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const { imageName, sequence, type, subtype, projectId} = req.body;

    if (!imageName) {
      return res.status(400).json({ error: 'Image Name Required' });
    }

    if (!sequence) {
      return res.status(400).json({ error: 'Sequence Required' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Type is Required' });
    }



    console.log(createPrototype);

    
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
     const imageSizeInMB = imageSizeInBytes / (1024 * 1024);
      console.log('This is the image size in mb', imageSizeInMB);
 
     // Check if the image size exceeds the maximum allowed size (100KB)
     if (imageSizeInMB > 5) {
       console.error('Image size exceeds the maximum allowed size (5MB)');
       return res.status(400).json({ error: 'Image size exceeds the maximum allowed size (5MB)' });
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

    // Do something with the image data, such as saving it to a directory or database
    // Example: image.mv('/path/to/save/image.jpg');

    const newPrototype = new Prototype({
      projectId,
      imageName,
      sequence,
      image: imagePath,
      prototypeType: type,
      prototypeSubtype: subtype,
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
    const prototypes = await Prototype.find({ prototypeType: type, prototypeSubtype: subtype, projectId:id  });
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
    const prototypes = await Prototype.find({ prototypeType: type, projectId:id });
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

    // Validate input using Joi
    // const schema = Joi.object({
    //   imageName: Joi.string().required(),
    //   sequence: Joi.string().required(),
    // });

    // const { error } = schema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    const {imageName, sequence} = req.body;

    console.log(req.params);
    
    
    const updatedPrototype = await Prototype.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPrototype) {
      return res.status(404).json({ error: 'Prototype not found' });
    }

    //res.json(updatedUser);
    res.json({ status: 200, message: 'Image changed successfully', prototype:updatedPrototype });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// Controller for deleting a prototype by ID
const deletePrototypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPrototype = await Prototype.findByIdAndDelete( id );
    res.json(deletedPrototype);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createPrototype,
  getPrototypeByTypeAndSubtypeById,
  getPrototypeByTypeById,
  updatePrototypeById,
  deletePrototypeById,
};