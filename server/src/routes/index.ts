import { Router } from 'express';
import { ContentController } from '../controllers/ContentController';
import { InquiryController } from '../controllers/InquiryController';
import { AdminController } from '../controllers/AdminController';
import { authenticateToken } from '../middleware/auth';
import uploadRoute from './upload';

const router = Router();

// Content routes
router.get('/content', ContentController.getContent);
router.post('/content', authenticateToken, ContentController.updateContent);

// Inquiry routes
router.post('/inquiries', InquiryController.addInquiry);
router.patch('/inquiries', InquiryController.updateInquiryStatus);
router.delete('/inquiries', InquiryController.deleteInquiry);

// Admin routes
router.get('/auth/me', authenticateToken, AdminController.getMe);
router.post('/auth/logout', AdminController.logout);
router.post('/admin/auth', authenticateToken, AdminController.handleAuth);
router.post('/auth/login', AdminController.login);

// Upload routes
router.use('/upload', authenticateToken, uploadRoute);

export default router;
