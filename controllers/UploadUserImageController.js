const handleImageUpload = async (req, res) => {
  try {
    
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

module.exports = { handleImageUpload };
