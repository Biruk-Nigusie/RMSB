import express from 'express';
import { createComplaint, getAllComplaints, getMyComplaints, updateComplaintStatus, deleteComplaint } from '../controllers/complaintController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createComplaint);
router.get('/', getAllComplaints);
router.get('/my', getMyComplaints);
router.put('/:id', authenticateToken, updateComplaintStatus);
router.delete('/:id', authenticateToken, deleteComplaint);

export default router;