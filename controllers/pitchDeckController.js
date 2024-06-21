const PitchDeck = require('../models/PitchDeckModel');
const joi = require('joi');
const fs = require('fs');
const path = require('path');


// Controller function to create a new pitch deck
async function createPitchDeck(req, res) {
  try {
    console.log(req.body);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const { documentName,  projectId} = req.body;

    if (!documentName) {
      return res.status(400).json({ error: 'Image Name Required' });
    }


    console.log(createPitchDeck);

    
    const directory = path.join(__dirname, '../public', 'document');
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

    


    // Create new pitch deck
    const newPitchDeck = await PitchDeck({
      projectId,
      documentName,
      document: imagePath,
    });
    console.log(newPitchDeck);
    await newPitchDeck.save();
    

    res.status(200).json({ message: 'Document uploaded successfully' });
  } catch (error) {
    console.log('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller function to get a pitch deck by ID
async function getPitchDeckById(req, res) {
  try {

    const {projectId} = req.params;
    const pitchDeck = await PitchDeck.find( projectId );
    if (!pitchDeck) {
      return res.status(404).json({ message: 'Pitch deck not found' });
    }

    
    res.json(pitchDeck);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Controller function to update a pitch deck by ID
async function updatePitchDeckById(req, res) {
  try {

    const { id } = req.params;
    const { documentType } = req.body;

    // Check if required fields are provided
    if (!documentType) {
      return res.status(400).json({ message: 'document and documentType are required' });
    }

    console.log(req.params);
    
    
    const updatedPitchDeck = await Prototype.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPitchDeck) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Update the pitch deck with provided data
    await updatedPitchDeck.save();

  //res.json(updatedUser);
  res.json({ status: 200, message: 'Ducument changed successfully', PitchDeck:updatedPitchDeck });
} catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
}
}

// Controller function to delete a pitch deck by ID
async function deletePitchDeckById(req, res) {
  try {
    const deletedPitchDeck = await PitchDeck.findByIdAndDelete(req.params.id);
    if (!deletedPitchDeck) {
      return res.status(404).json({ message: 'Pitch deck not found' });
    }
    res.json({ message: 'Pitch deck deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  createPitchDeck,
  getPitchDeckById,
  updatePitchDeckById,
  deletePitchDeckById
};
