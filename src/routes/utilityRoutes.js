import express from 'express';
import { createUtilityBill, getAllUtilities, payUtilityBill, reportUtilityIssue, resolveUtilityIssue } from '../controllers/utilityController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createUtilityBill);
router.get('/', authenticateToken, getAllUtilities);
router.post('/pay/:id', authenticateToken, payUtilityBill);
router.post('/report', authenticateToken, reportUtilityIssue);
router.put('/reports/:id/resolve', authenticateToken, requireAdmin, resolveUtilityIssue);

export default router;