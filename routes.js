
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
  const folderPath = path.join(__dirname, 'video'); // Update 'your-base-folder' with the actual base folder path

  try {
    // Check if the folder exists
    const folderStat = await fs.statSync(folderPath,(err, folderStat) => {
        if (err) {
          // Handle the error
          console.error(err);
        } else {
          // Handle the folderStat object (contains information about the folder)
          console.log(folderStat);
        }
      });

    if (!folderStat.isDirectory()) {
      // Handle case where the path is not a directory
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Delete the folder and its contents with a callback
    await fs.rm(folderPath, { recursive: true });
  } catch (error) {
      // Handle case where the folder does not exist
      return res.status(404).json({ error: 'Folder not found' });
  }
});

module.exports = router;

