import express from 'express';
import { exportData, deleteData } from '../controllers/dataController.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/export/:type', authenticateToken, requireSuperAdmin, exportData);
router.delete('/delete/:type', authenticateToken, requireSuperAdmin, deleteData);

export default router;