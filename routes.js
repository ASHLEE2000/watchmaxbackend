
//***************** Author ASHLEY FERNANDES ********************************//
// Copyright belongs to the author
// handles create user, token and refresh token

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./authMiddleware');
const { videoController, getHealth, upload } = require('./controller');  // Import 'upload' from controller
const { login, refreshToken, getProtectedData } = require('./authController');
const path = require('path');
const fs = require('fs');


//protected routes
router.get('/', authenticateToken, getProtectedData);
router.post('/upload-video', authenticateToken, upload.single('file'), videoController);

// unprotected routes
router.get('/health', getHealth);

// routes to create user and handle authentication for the app
router.post('/login', login);
router.post('/refreshToken', refreshToken);

router.delete('/delete', async (req, res) => {
    const folderName = req.params.folderName;
    const folderPath = path.join(__dirname, 'video', folderName); // Update 'your-base-folder' with the actual base folder path
  
    try {
      // Check if the folder exists
      const folderExists = await fs.access(folderPath, fs.constants.F_OK).then(() => true).catch(() => false);
  
      if (!folderExists) {
        return res.status(404).json({ error: 'Folder not found' });
      }
  
      // Delete the folder and its contents
      await fs.rmdir(folderPath, { recursive: true });
  
      res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
      console.error('Error deleting folder:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;

