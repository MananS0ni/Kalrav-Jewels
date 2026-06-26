const User = require('../models/User');

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { adminOnly };
