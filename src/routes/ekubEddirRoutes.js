import express from 'express';
import multer from 'multer';
import path from 'path';
import { createGroup, getAllGroups, addMember, recordPayment, getPaymentHistory, requestJoin, approveJoinRequest, selectRandomWinner, sendPaymentReminder, sendGroupAnnouncement, getGroupMembers, getJoinRequests } from '../controllers/ekubEddirController.js';
import { authenticateToken } from '../middleware/auth.js';

const qrStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/qr-codes/')
  },
  filename: (req, file, cb) => {
    cb(null, `qr-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const proofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/payment-proofs/')
  },
  filename: (req, file, cb) => {
    cb(null, `proof-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const uploadQR = multer({ storage: qrStorage })
const uploadProof = multer({ storage: proofStorage })

const router = express.Router();

router.post('/', authenticateToken, uploadQR.single('qrCodeFile'), createGroup);
router.get('/', authenticateToken, getAllGroups);
router.post('/:id/join', authenticateToken, requestJoin);
router.post('/:id/approve/:requestId', authenticateToken, approveJoinRequest);
router.post('/:id/members', authenticateToken, addMember);
router.get('/:id/members', authenticateToken, getGroupMembers);
router.get('/:id/join-requests', authenticateToken, getJoinRequests);
router.post('/:id/payment', authenticateToken, uploadProof.single('proofFile'), recordPayment);
router.get('/:id/payments', authenticateToken, getPaymentHistory);
router.post('/:id/select-winner', authenticateToken, selectRandomWinner);
router.post('/:id/send-reminder', authenticateToken, sendPaymentReminder);
router.post('/:id/announcement', authenticateToken, sendGroupAnnouncement);

export default router;