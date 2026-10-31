import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'toonverse_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const generateDownloadToken = (userId, cartoonId, quality) => {
  return jwt.sign(
    { userId, cartoonId, quality, type: 'download_auth' },
    process.env.JWT_SECRET || 'toonverse_super_secret_jwt_key_2026',
    { expiresIn: '15m' } // 15 minutes validity
  );
};

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'toonverse_super_secret_jwt_key_2026');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'toonverse_super_secret_jwt_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
  }
};
