import express from 'express';
import { getAllAuditLogs, clearAuditLogs } from '../controllers/auditController.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, requireSuperAdmin, getAllAuditLogs);
router.delete('/clear', authenticateToken, requireSuperAdmin, clearAuditLogs);

export default router;