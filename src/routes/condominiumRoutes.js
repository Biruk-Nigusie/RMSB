import express from 'express';
import { getAllCondominiums } from '../controllers/condominiumController.js';

const router = express.Router();

router.get('/', getAllCondominiums);

export default router;