import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  streamVideo,
  downloadVideo,
  scanContainer,
  uploadVideo,
  VIDEO_CONTAINER_DIR,
} from '../controllers/mediaController.js';
import { optionalAuth, protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Multer storage configuration for video_container
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, VIDEO_CONTAINER_DIR);
  },
  filename: (req, file, cb) => {
    // Preserve original name or sanitize
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 10 }, // 10 GB limit per file!
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.mp4', '.mkv', '.webm', '.mov', '.avi'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files (.mp4, .mkv, .webm, .mov, .avi) are supported'));
    }
  },
});

// Video Streaming & Downloads
router.get('/stream/:slug/:filename?', streamVideo);
router.get('/download/:slug/:filename?', downloadVideo);

// File Manager & Scanner
router.get('/files', scanContainer);

// Upload video (admin or authorized)
router.post('/upload', upload.single('video'), uploadVideo);

export default router;
