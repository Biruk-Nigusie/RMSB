import express from 'express';
import { getAllCondominiums, createCondominium, updateCondominium, deleteCondominium } from '../controllers/condominiumController.js';

const router = express.Router();

router.get('/', getAllCondominiums);
router.post('/', createCondominium);
router.put('/:id', updateCondominium);
router.delete('/:id', deleteCondominium);

export default router;