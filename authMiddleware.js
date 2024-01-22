
//***************** Author ASHLEY FERNANDES ********************************//
// Copyright belongs to the author
// handles user verification
// authMiddleware.js

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader? authHeader.split(' ')[1]: null;
    if(!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, data) => {
        if(err) {
            console.log(err.message)
            return res.sendStatus(403);
        }

        req.userData = data;
        next();
    })
};

module.exports = {
  authenticateToken,
};
