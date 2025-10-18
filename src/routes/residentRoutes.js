import express from 'express';
import { getAllResidents, getResidentById, updateResident, deleteResident } from '../controllers/residentController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireAdmin, getAllResidents);
router.get('/:id', authenticateToken, getResidentById);
router.put('/:id', authenticateToken, updateResident);
router.delete('/:id', authenticateToken, requireAdmin, deleteResident);

export default router;