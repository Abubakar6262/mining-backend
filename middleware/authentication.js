const jwt = require('jsonwebtoken');
const tokenCache = require('../utils/tokenStore');

module.exports = function (req, res, next) {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  // Check if token exists in server memory
  if (!tokenCache.get(token)) {
    return res.status(401).json({ message: 'Invalid Token' });
  }

  try {
    // Verify token using secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user payload to request object
    req.user = verified;

    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid Token' });
  }
};
