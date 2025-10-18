import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type === 'admin') {
      const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
      if (!admin) return res.status(403).json({ error: 'Invalid token' });
      req.user = { ...admin, type: 'admin' };
    } else {
      const resident = await prisma.resident.findUnique({ where: { id: decoded.id } });
      if (!resident) return res.status(403).json({ error: 'Invalid token' });
      req.user = { ...resident, type: 'resident' };
    }
    
    next();
  } catch (error) {
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