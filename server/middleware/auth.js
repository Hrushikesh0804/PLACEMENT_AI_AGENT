const jwt = require('jsonwebtoken');

// This middleware function will be used to protect routes
module.exports = function (req, res, next) {
  // 1. Get the token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If a token is found, verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add the user payload from the token to the request object
    req.user = decoded.user;
    next(); // Proceed to the next function (the route handler)
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
