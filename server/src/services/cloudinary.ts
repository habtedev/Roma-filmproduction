import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../config/.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Robust check for video files
    const isVideo = file.mimetype.startsWith('video/') || file.originalname.match(/\.(mp4|mov|avi|mkv|webm)$/i);

    return {
      folder: isVideo ? 'roma_film/videos' : 'roma_film/images',
      resource_type: 'auto', // Auto-detect to prevent forced image limits
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'avi', 'mkv', 'webm'],
      chunk_size: 6000000, // 6MB chunks to bypass the 10MB default stream limit for large files
      // Cloudinary will auto-generate a unique public_id
    } as any;
  },
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: Infinity } // Completely unlimited on the Node server
});
export { cloudinary };
