import { Router } from 'express';
import { upload } from '../services/cloudinary';

const router = Router();

router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // req.file.path contains the secure Cloudinary URL
    res.json({
      success: true,
      url: req.file.path,
      format: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, error: 'Failed to upload asset' });
  }
});

export default router;
