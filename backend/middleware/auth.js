const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects a route: the request must carry a valid JWT in the header
//   Authorization: Bearer <token>
const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please log in first.' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }
    req.user = user; // available in the route handlers
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
};

module.exports = protect;
