import User from '../models/User.js';
import Cartoon from '../models/Cartoon.js';
import { generateToken } from '../middleware/auth.js';

// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: userExists.email === email ? 'Email already registered' : 'Username already taken',
      });
    }

    // First user can be admin, or standard user
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? 'admin' : 'user';

    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ success: false, message: 'Please provide credentials' });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/auth/favorites/:cartoonId
export const toggleFavorite = async (req, res) => {
  try {
    const { cartoonId } = req.params;
    const user = await User.findById(req.user._id);

    const exists = user.favorites.some(id => id.toString() === cartoonId);
    if (exists) {
      user.favorites = user.favorites.filter(id => id.toString() !== cartoonId);
    } else {
      user.favorites.push(cartoonId);
    }

    await user.save();

    res.json({
      success: true,
      isFavorite: !exists,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/auth/favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({
      success: true,
      favorites: user.favorites || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
