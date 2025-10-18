import express from 'express';
import { getResidentDashboard, getAdminDashboard, getSuperAdminDashboard } from '../controllers/dashboardController.js';
import { authenticateToken, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/resident', authenticateToken, getResidentDashboard);
router.get('/admin', authenticateToken, requireAdmin, getAdminDashboard);
router.get('/super', authenticateToken, requireSuperAdmin, getSuperAdminDashboard);

export default router;