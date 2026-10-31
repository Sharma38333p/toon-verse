import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Cartoon from '../models/Cartoon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root video container path
export const VIDEO_CONTAINER_DIR = path.resolve(__dirname, '../../video_container');

// Ensure directory exists
if (!fs.existsSync(VIDEO_CONTAINER_DIR)) {
  fs.mkdirSync(VIDEO_CONTAINER_DIR, { recursive: true });
}

// Helper to find a video file matching a slug or filename
const findVideoFile = (slugOrName, specificFilename) => {
  if (!fs.existsSync(VIDEO_CONTAINER_DIR)) return null;

  // 1. Direct path inside a cartoon subfolder
  if (specificFilename) {
    const subfolderPath = path.join(VIDEO_CONTAINER_DIR, slugOrName, specificFilename);
    if (fs.existsSync(subfolderPath) && fs.statSync(subfolderPath).isFile()) {
      return subfolderPath;
    }
  }

  // 2. Check if subfolder exists for the slug and has any video
  const subfolder = path.join(VIDEO_CONTAINER_DIR, slugOrName);
  if (fs.existsSync(subfolder) && fs.statSync(subfolder).isDirectory()) {
    const files = fs.readdirSync(subfolder);
    const videoFile = files.find(f => /\.(mp4|mkv|webm|mov|avi)$/i.test(f));
    if (videoFile) return path.join(subfolder, videoFile);
  }

  // 3. Check directly in root of video_container for matching filename
  const rootFiles = fs.readdirSync(VIDEO_CONTAINER_DIR);
  const matched = rootFiles.find(f =>
    f.toLowerCase().includes(slugOrName.toLowerCase()) && /\.(mp4|mkv|webm|mov|avi)$/i.test(f)
  );
  if (matched) return path.join(VIDEO_CONTAINER_DIR, matched);

  // 4. Return any video file in the entire container as fallback demo if available
  for (const item of rootFiles) {
    const full = path.join(VIDEO_CONTAINER_DIR, item);
    if (fs.statSync(full).isFile() && /\.(mp4|mkv|webm|mov|avi)$/i.test(item)) {
      return full;
    }
    if (fs.statSync(full).isDirectory()) {
      const subFiles = fs.readdirSync(full);
      const firstVid = subFiles.find(f => /\.(mp4|mkv|webm|mov|avi)$/i.test(f));
      if (firstVid) return path.join(full, firstVid);
    }
  }

  return null;
};

// @route   GET /api/media/stream/:slug/:filename?
// @desc    High-performance HTTP 206 Partial Content video streaming
export const streamVideo = async (req, res) => {
  try {
    const { slug, filename } = req.params;
    const filePath = findVideoFile(slug, filename);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: `Video not found in video_container for '${slug}'. Place your .mp4 in d:\\ToonVerse\\video_container\\${slug}\\`,
      });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mkv': 'video/x-matroska',
      '.mov': 'video/quicktime',
    };
    const contentType = mimeTypes[ext] || 'video/mp4';

    if (range) {
      // Parse Range header (e.g. "bytes=32324-")
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 1024 * 1024 * 2, fileSize - 1); // 2MB chunk buffer

      const chunkSize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });

      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      };

      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error('Streaming error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/media/download/:slug/:filename?
// @desc    Direct authorized video file download from video_container
export const downloadVideo = async (req, res) => {
  try {
    const { slug, filename } = req.params;
    const filePath = findVideoFile(slug, filename);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found in video_container',
      });
    }

    const downloadFileName = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFileName}"`);
    res.setHeader('X-Server-Source', 'ToonVerse-Local-Cloud');

    res.download(filePath, downloadFileName, (err) => {
      if (err && !res.headersSent) {
        res.status(500).json({ success: false, message: 'Download error' });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   GET /api/media/files
// @desc    Scan and list all cartoon videos in video_container
export const scanContainer = async (req, res) => {
  try {
    const results = [];

    const scanDir = (dir, relPath = '') => {
      if (!fs.existsSync(dir)) return;
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const full = path.join(dir, item);
        const rel = path.join(relPath, item).replace(/\\/g, '/');
        const stat = fs.statSync(full);

        if (stat.isDirectory()) {
          scanDir(full, rel);
        } else if (/\.(mp4|mkv|webm|mov|avi)$/i.test(item)) {
          const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
          const sizeGB = (stat.size / (1024 * 1024 * 1024)).toFixed(2);

          const folderName = relPath.split('/')[0] || '';

          results.push({
            name: item,
            relativePath: rel,
            folder: folderName,
            size: stat.size > 1024 * 1024 * 1024 ? `${sizeGB} GB` : `${sizeMB} MB`,
            sizeBytes: stat.size,
            format: path.extname(item).toUpperCase().replace('.', ''),
            modified: stat.mtime,
            streamUrl: `/api/media/stream/${folderName || 'root'}/${encodeURIComponent(item)}`,
            downloadUrl: `/api/media/download/${folderName || 'root'}/${encodeURIComponent(item)}`,
          });
        }
      }
    };

    scanDir(VIDEO_CONTAINER_DIR);

    res.json({
      success: true,
      containerPath: VIDEO_CONTAINER_DIR,
      count: results.length,
      files: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route   POST /api/media/upload
// @desc    Upload video directly into video_container
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided' });
    }

    const { cartoonSlug } = req.body;
    let finalPath = req.file.path;

    if (cartoonSlug) {
      const targetDir = path.join(VIDEO_CONTAINER_DIR, cartoonSlug);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const newPath = path.join(targetDir, req.file.originalname);
      fs.renameSync(req.file.path, newPath);
      finalPath = newPath;
    }

    res.status(201).json({
      success: true,
      message: 'Video successfully uploaded to video_container!',
      file: {
        name: req.file.originalname,
        size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
        path: finalPath,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
