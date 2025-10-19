import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

export const authenticateToken = async (req, res, next) => {
  console.log('=== AUTH MIDDLEWARE DEBUG ===');
  console.log('Request URL:', req.url);
  console.log('Request method:', req.method);
  
  const authHeader = req.headers['authorization'];
  console.log('Auth header:', authHeader);
  
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Extracted token:', token ? 'Present' : 'Missing');

  if (!token) {
    console.log('ERROR: No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    if (decoded.type === 'admin') {
      console.log('Looking up admin with ID:', decoded.id);
      const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
      if (!admin) {
        console.log('ERROR: Admin not found');
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = { id: admin.id, type: 'admin', ...admin };
      console.log('Admin authenticated:', admin.id);
    } else {
      console.log('Looking up resident with ID:', decoded.id);
      const resident = await prisma.resident.findUnique({ where: { id: decoded.id } });
      if (!resident) {
        console.log('ERROR: Resident not found');
        return res.status(403).json({ error: 'Invalid token' });
      }
      req.user = { id: resident.id, type: 'resident', ...resident };
      console.log('Resident authenticated:', resident.id);
    }
    
    console.log('Final req.user:', { id: req.user.id, type: req.user.type });
    console.log('=== AUTH MIDDLEWARE SUCCESS ===');
    next();
  } catch (error) {
    console.log('=== AUTH MIDDLEWARE ERROR ===');
    console.log('JWT verification error:', error.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.type !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.user.type !== 'admin' || req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
};