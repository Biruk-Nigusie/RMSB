import express from 'express';
import { createNotification, getUserNotifications, markAsRead } from '../controllers/notificationController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/send', authenticateToken, requireAdmin, createNotification);
router.get('/', authenticateToken, getUserNotifications);
router.put('/:id/read', authenticateToken, markAsRead);

export default router;