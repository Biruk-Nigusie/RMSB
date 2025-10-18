import express from 'express';
import { createServiceProvider, getAllServiceProviders, payServiceFee, rateProvider } from '../controllers/serviceController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, requireAdmin, createServiceProvider);
router.get('/', authenticateToken, getAllServiceProviders);
router.post('/:id/pay', authenticateToken, payServiceFee);
router.post('/:id/rating', authenticateToken, rateProvider);

export default router;