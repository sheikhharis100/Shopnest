import express from 'express';
import { upload } from '../utils/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'Image uploaded successfully',
    imageUrl: req.file.path,
  });
});

export default router;