const jwt = require('jsonwebtoken');

/**
 * @description Middleware to authenticate and authorize a user.
 * It checks for a JSON Web Token (JWT) in the 'x-auth-token' header.
 * If the token is valid, it attaches the user's payload to the request object
 * and passes control to the next middleware function.
 * If the token is missing or invalid, it sends a 401 Unauthorized response.
 */
module.exports = function (req, res, next) {
  // 1. Get token from the 'x-auth-token' header
  const token = req.header('x-auth-token');

  // 2. Check if no token is present
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. Verify the token
  try {
    // Decode the token using your JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user payload to the request object
    req.user = decoded.user;

    // Pass control to the next middleware in the stack (the route handler)
    next();
  } catch (err) {
    // If token is not valid (e.g., expired, malformed)
    res.status(401).json({ msg: 'Token is not valid' });
  }
};