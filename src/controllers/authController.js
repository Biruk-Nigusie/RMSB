import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import prisma from '../utils/db.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, phone, email, block, houseNo, ownershipType, ownerName, familyMembers, carPlate, condominiumId, password } = req.body;

    const existingResident = await prisma.resident.findUnique({ where: { phone } });
    if (existingResident) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const resident = await prisma.resident.create({
      data: {
        fullName,
        phone,
        email,
        block,
        houseNo,
        ownershipType,
        ownerName,
        familyMembers,
        carPlate,
        condominiumId,
        passwordHash: hashedPassword
      }
    });

    const token = jwt.sign({ id: resident.id, type: 'resident' }, process.env.JWT_SECRET);
    
    res.status(201).json({
      message: 'Resident registered successfully',
      token,
      user: { id: resident.id, fullName: resident.fullName, phone: resident.phone, type: 'resident' }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password, userType } = req.body;

    let user;
    if (userType === 'admin') {
      user = await prisma.admin.findUnique({ where: { phone } });
    } else {
      user = await prisma.resident.findUnique({ where: { phone } });
    }

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, type: userType }, process.env.JWT_SECRET);
    
    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user.id, 
        name: user.fullName || user.name, 
        phone: user.phone, 
        type: userType,
        role: user.role 
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id, type } = req.user;
    
    let user;
    if (type === 'admin') {
      user = await prisma.admin.findUnique({ where: { id } });
    } else {
      user = await prisma.resident.findUnique({ where: { id } });
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { passwordHash, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id, type } = req.user;
    const updateData = req.body;
    delete updateData.passwordHash;

    // Handle profileImage field gracefully
    const allowedFields = {
      fullName: updateData.fullName,
      email: updateData.email,
      phone: updateData.phone,
      block: updateData.block,
      houseNo: updateData.houseNo,
      familyMembers: updateData.familyMembers ? parseInt(updateData.familyMembers) : undefined,
      carPlate: updateData.carPlate,
    };

    // Temporarily store profile image URL (until migration is run)
    if (updateData.profileImage) {
      // For now, we'll need to handle this differently since the column doesn't exist yet
      // Skip profileImage update until database migration is complete
      console.log('Profile image URL received:', updateData.profileImage);
    }

    // Remove undefined fields
    Object.keys(allowedFields).forEach(key => {
      if (allowedFields[key] === undefined) {
        delete allowedFields[key];
      }
    });

    let updatedUser;
    if (type === 'admin') {
      updatedUser = await prisma.admin.update({
        where: { id },
        data: allowedFields
      });
    } else {
      updatedUser = await prisma.resident.update({
        where: { id },
        data: allowedFields
      });
    }

    const { passwordHash, ...userProfile } = updatedUser;
    res.json(userProfile);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: error.message });
  }
};