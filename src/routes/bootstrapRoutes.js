import express from 'express';
import { body } from 'express-validator';
import { createBootstrapSuperAdmin } from '../controllers/bootstrapController.js';

const router = express.Router();

router.post('/super-admin', [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], createBootstrapSuperAdmin);

export default router;