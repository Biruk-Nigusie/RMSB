import express from 'express';
import multer from 'multer';
import path from 'path';
import { createParkingSlot, getAllParkingSlots, getAvailableSlots, assignParkingSlot, payParkingFee, createBulkSlots, requestParkingSlot, getMyParkingRequests, getAllParkingRequests, approveParkingRequest, rejectParkingRequest, deleteParkingSlot } from '../controllers/parkingController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const qrStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/qr-codes/')
  },
  filename: (req, file, cb) => {
    cb(null, `qr-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/')
  },
  filename: (req, file, cb) => {
    cb(null, `doc-${Date.now()}${path.extname(file.originalname)}`)
  }
})

const uploadQR = multer({ 
  storage: qrStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only images and PDF files are allowed'))
    }
  }
})

const uploadDoc = multer({ 
  storage: documentStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only images and PDF files are allowed'))
    }
  }
})

const router = express.Router();

router.post('/slots', createParkingSlot);
router.post('/slots/bulk', uploadQR.single('qrCode'), createBulkSlots);
router.delete('/slots/:id', deleteParkingSlot);
router.get('/slots', getAllParkingSlots);
router.get('/slots/available', getAvailableSlots);
router.put('/slots/:id', assignParkingSlot);
router.post('/request', authenticateToken, uploadDoc.single('document'), requestParkingSlot);
router.get('/my-requests', authenticateToken, getMyParkingRequests);
router.get('/requests', getAllParkingRequests);
router.put('/requests/:id/approve', approveParkingRequest);
router.put('/requests/:id/reject', rejectParkingRequest);
router.post('/pay', payParkingFee);

export default router;