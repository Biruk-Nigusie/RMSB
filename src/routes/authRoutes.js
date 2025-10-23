import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', [
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('phone').matches(/^\+251[79]\d{8}$/).withMessage('Valid Ethiopian phone number is required'),
  body('block').notEmpty().withMessage('Block is required'),
  body('houseNo').notEmpty().withMessage('House number is required'),
  body('ownershipType').isIn(['OWNED', 'RENTED']).withMessage('Invalid ownership type'),
  body('familyMembers').isInt({ min: 1 }).withMessage('Family members must be at least 1'),
  body('condominiumId').isUUID().withMessage('Valid condominium ID is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', [
  body('phone').matches(/^\+251[79]\d{8}$/).withMessage('Valid Ethiopian phone number is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('userType').isIn(['resident', 'admin']).withMessage('Invalid user type')
], login);

router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;