import express from 'express';
import { register, login, getMe, toggleFavorite, getFavorites } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/favorites/:cartoonId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

export default router;
