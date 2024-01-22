// const { videoController, upload } = require('./controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { generateFileName } = require('./helper');

const uploadDirectory = path.join(__dirname, 'videos');

const uniqueFileName = generateFileName();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const fileNameWithExtension = `${uniqueFileName}.mp4`;
    cb(null, fileNameWithExtension);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Invalid file type. Only video files are allowed.'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

function videoController(req, res) {
    try {
    const fileNameWithExtension = `${uniqueFileName}.mp4`;
    const filePath = path.join(uploadDirectory, fileNameWithExtension);

    // Use fs.exists to check if the file exists
    fs.exists(filePath, (exists) => {
      if (exists) {
        // Save metadata to the database or perform other actions as needed
        console.log('file save success!!')
        res.status(201).json({ success: true, message: 'File uploaded successfully' });
      } else {
        console.error('Error: File not saved in the videos folder');
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

const getHealth = (req, res) => {
    // Respond with a 200 status and a JSON message
    res.status(200).json({ message: 'Server is healthy!' });
  };

module.exports = {
  videoController,
  getHealth,
  upload,
};
