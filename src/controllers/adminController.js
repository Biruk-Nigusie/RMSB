import bcrypt from 'bcryptjs';
import prisma from '../utils/db.js';

export const createAdmin = async (req, res) => {
  try {
    const { name, phone, email, role, assignedCondominium, password } = req.body;

    // Validate Ethiopian phone number format
    const phoneRegex = /^\+251[79]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Must be +251 followed by 7 or 9 and 8 digits' });
    }

    // Validate condominium exists if assignedCondominium is provided
    if (assignedCondominium) {
      console.log('Checking condominium:', assignedCondominium);
      const condominiumExists = await prisma.condominium.findFirst({
        where: {
          OR: [
            { id: assignedCondominium },
            { name: assignedCondominium }
          ]
        }
      });
      console.log('Condominium found:', condominiumExists);
      if (!condominiumExists) {
        return res.status(400).json({ error: 'Condominium does not exist' });
      }
    }

    const existingAdmin = await prisma.admin.findFirst({
      where: { OR: [{ phone }, { email }] }
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Phone or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name,
        phone,
        email,
        role,
        assignedCondominium,
        passwordHash: hashedPassword
      }
    });

    const { passwordHash, ...adminData } = admin;
    res.status(201).json({ message: 'Admin created successfully', admin: adminData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        assignedCondominium: true
      }
    });

    res.json({ data: admins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData.passwordHash;

    // Validate Ethiopian phone number format if phone is being updated
    if (updateData.phone) {
      const phoneRegex = /^\+251[79]\d{8}$/;
      if (!phoneRegex.test(updateData.phone)) {
        return res.status(400).json({ error: 'Invalid phone number format. Must be +251 followed by 7 or 9 and 8 digits' });
      }
    }

    const admin = await prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        assignedCondominium: true
      }
    });

    res.json({ message: 'Admin updated successfully', admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.admin.delete({ where: { id } });

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};