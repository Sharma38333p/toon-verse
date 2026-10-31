import express from 'express';
import { requestDownloadToken, verifyDownloadToken } from '../controllers/downloadController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/request-token', optionalAuth, requestDownloadToken);
router.get('/verify/:token', verifyDownloadToken);

export default router;
