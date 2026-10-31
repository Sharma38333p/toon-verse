import express from 'express';
import { getAdminStats, createCartoon, updateCartoon, deleteCartoon } from '../controllers/adminController.js';

const router = express.Router();

// Direct admin access for seamless local management
router.get('/stats', getAdminStats);
router.post('/cartoons', createCartoon);
router.put('/cartoons/:id', updateCartoon);
router.delete('/cartoons/:id', deleteCartoon);

export default router;
