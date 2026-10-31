import Cartoon from '../models/Cartoon.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { generateDownloadToken } from '../middleware/auth.js';

// @route   POST /api/downloads/request-token
// @desc    Generate an authorized, temporary download token for a cartoon
export const requestDownloadToken = async (req, res) => {
  try {
    const { cartoonId, quality } = req.body;

    if (!cartoonId || !quality) {
      return res.status(400).json({ success: false, message: 'Cartoon ID and quality are required' });
    }

    const cartoon = await Cartoon.findById(cartoonId);
    if (!cartoon) {
      return res.status(404).json({ success: false, message: 'Cartoon not found' });
    }

    const link = cartoon.downloadLinks.find(l => l.quality === quality) || cartoon.downloadLinks[0];
    if (!link) {
      return res.status(404).json({ success: false, message: 'Requested quality is not available' });
    }

    const userId = req.user ? req.user._id : 'guest';
    const downloadToken = generateDownloadToken(userId, cartoon._id, link.quality);

    // If user is authenticated, record in downloads history
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          downloadsHistory: {
            cartoon: cartoon._id,
            quality: link.quality,
            downloadedAt: new Date(),
          },
        },
      });
    }

    // Increment download count
    cartoon.downloadCount += 1;
    await cartoon.save();

    res.json({
      success: true,
      message: 'Authorized download link generated',
      token: downloadToken,
      fileInfo: {
        title: cartoon.title,
        quality: link.quality,
        size: link.size,
        format: link.format,
        resolution: link.resolution,
        audioLanguages: link.audioLanguages,
        downloadUrl: link.downloadUrl,
      },
      expiresIn: '15 minutes',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/downloads/verify/:token
// @desc    Verify authorization token and allow downloading
export const verifyDownloadToken = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'toonverse_super_secret_jwt_key_2026');
    if (decoded.type !== 'download_auth') {
      return res.status(400).json({ success: false, message: 'Invalid token type' });
    }

    const cartoon = await Cartoon.findById(decoded.cartoonId);
    if (!cartoon) {
      return res.status(404).json({ success: false, message: 'Cartoon resource not found' });
    }

    const link = cartoon.downloadLinks.find(l => l.quality === decoded.quality) || cartoon.downloadLinks[0];

    res.json({
      success: true,
      authorized: true,
      message: 'Token verified successfully',
      title: cartoon.title,
      downloadUrl: link.downloadUrl,
      quality: link.quality,
      size: link.size,
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Download token is invalid or has expired' });
  }
};
