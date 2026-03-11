import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed (jpg, png, gif)'));
  }
});

router.get('/api/images', requireAuth, (req, res) => {
  // Read files from directory directly since we have no DB
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Could not read gallery' });
    
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
      .map((file, index) => ({
        id: file, // Use filename as ID
        filename: file,
        upload_date: fs.statSync(path.join(uploadDir, file)).mtime
      }))
      .sort((a, b) => b.upload_date - a.upload_date);

    res.json(images);
  });
});

router.post('/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.redirect('/gallery');
});

router.delete('/image/:filename', requireAuth, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

export default router;
