import express from 'express';
import { globalSearch } from '../controllers/searchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, globalSearch);

export default router;