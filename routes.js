
//***************** Author ASHLEY FERNANDES ********************************//
// Copyright belongs to the author
// handles create user, token and refresh token

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./authMiddleware');
const { videoController, getHealth, upload } = require('./controller');  // Import 'upload' from controller
const { login, refreshToken, getProtectedData } = require('./authController');


//protected routes
router.get('/', authenticateToken, getProtectedData);
router.post('/upload-video', authenticateToken, upload.single('file'), videoController);

// unprotected routes
router.get('/health', getHealth);

// routes to create user and handle authentication for the app
router.post('/login', login);
router.post('/refreshToken', refreshToken);

module.exports = router;

