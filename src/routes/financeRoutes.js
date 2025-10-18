import express from 'express';
import { getFinancialSummary, getIncomeReport } from '../controllers/financeController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/summary', authenticateToken, requireAdmin, getFinancialSummary);
router.get('/income', authenticateToken, requireAdmin, getIncomeReport);

export default router;