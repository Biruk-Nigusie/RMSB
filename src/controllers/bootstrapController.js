import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

export const createBootstrapSuperAdmin = async (req, res) => {
  try {
    // Check if any super admin already exists
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingSuperAdmin) {
      return res.status(400).json({ error: 'Super admin already exists. Bootstrap not allowed.' });
    }

    const { name, phone, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await prisma.admin.create({
      data: {
        name,
        phone,
        email,
        role: 'SUPER_ADMIN',
        passwordHash: hashedPassword
      }
    });

    const token = jwt.sign({ id: superAdmin.id, type: 'admin' }, process.env.JWT_SECRET);

    const { passwordHash, ...adminData } = superAdmin;
    res.status(201).json({
      message: 'Bootstrap super admin created successfully',
      token,
      admin: adminData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};