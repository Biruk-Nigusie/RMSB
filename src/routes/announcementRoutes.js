import express from 'express';
import { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createAnnouncement);
router.get('/', authenticateToken, getAllAnnouncements);
router.get('/:id', authenticateToken, getAnnouncementById);
router.put('/:id', authenticateToken, requireAdmin, updateAnnouncement);
router.delete('/:id', authenticateToken, requireAdmin, deleteAnnouncement);

export default router;