import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

import cartoonRoutes from './routes/cartoonRoutes.js';
import authRoutes from './routes/authRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware - Allow all origins (localhost, 127.0.0.1, LAN IP)
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/cartoons', cartoonRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/media', mediaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ToonVerse API & Local Media Server is flying high! 🚀',
    time: new Date().toISOString(),
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    app: 'ToonVerse API & Video Container Server',
    version: '1.0.0',
    documentation: '/api/cartoons, /api/auth, /api/downloads, /api/admin, /api/media',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`🎬 ToonVerse server & Video Container streaming running on http://localhost:${PORT}`);
});
