import express from 'express';
import { createAdmin, getAllAdmins, updateAdmin, deleteAdmin } from '../controllers/adminController.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, requireSuperAdmin, createAdmin);
router.get('/', authenticateToken, requireSuperAdmin, getAllAdmins);
router.put('/:id', authenticateToken, requireSuperAdmin, updateAdmin);
router.delete('/:id', authenticateToken, requireSuperAdmin, deleteAdmin);

export default router;