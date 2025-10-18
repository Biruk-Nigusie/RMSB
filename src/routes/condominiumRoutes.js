import express from 'express';
import { getAllCondominiums, createCondominium } from '../controllers/condominiumController.js';

const router = express.Router();

router.get('/', getAllCondominiums);
router.post('/', createCondominium);

export default router;