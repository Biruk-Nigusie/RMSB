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

    // Validate Ethiopian phone number format
    const phoneRegex = /^\+251[79]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Must be +251 followed by 7 or 9 and 8 digits' });
    }

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

    // Validate Ethiopian phone number format
    const phoneRegex = /^\+251[79]\d{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Must be +251 followed by 7 or 9 and 8 digits' });
    }

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
  console.log('=== UPDATE PROFILE DEBUG START ===');
  console.log('Request headers:', req.headers);
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  console.log('Request user:', req.user);
  
  try {
    const { id, type } = req.user;
    
    console.log('User ID:', id);
    console.log('User Type:', type);
    
    if (!id || !type) {
      console.log('ERROR: Invalid user session');
      return res.status(401).json({ error: 'Invalid user session' });
    }
    
    const updateData = req.body;
    delete updateData.passwordHash;
    
    console.log('Update data after cleanup:', JSON.stringify(updateData, null, 2));

    // Build allowed fields based on user type
    const allowedFields = {};
    
    // Common fields for both admin and resident
    if (updateData.fullName !== undefined && updateData.fullName !== '') {
      allowedFields.fullName = updateData.fullName;
      console.log('Added fullName:', updateData.fullName);
    }
    if (updateData.email !== undefined && updateData.email !== '') {
      allowedFields.email = updateData.email;
      console.log('Added email:', updateData.email);
    }
    if (updateData.phone !== undefined && updateData.phone !== '') {
      // Validate Ethiopian phone number format
      const phoneRegex = /^\+251[79]\d{8}$/;
      if (!phoneRegex.test(updateData.phone)) {
        return res.status(400).json({ error: 'Invalid phone number format. Must be +251 followed by 7 or 9 and 8 digits' });
      }
      allowedFields.phone = updateData.phone;
      console.log('Added phone:', updateData.phone);
    }
    if (updateData.profileImage !== undefined) {
      allowedFields.profileImage = updateData.profileImage;
      console.log('Added profileImage:', updateData.profileImage);
    }
    
    // Resident-specific fields
    if (type === 'resident') {
      console.log('Processing resident-specific fields');
      if (updateData.block !== undefined && updateData.block !== '') {
        allowedFields.block = updateData.block;
        console.log('Added block:', updateData.block);
      }
      if (updateData.houseNo !== undefined && updateData.houseNo !== '') {
        allowedFields.houseNo = updateData.houseNo;
        console.log('Added houseNo:', updateData.houseNo);
      }
      if (updateData.carPlate !== undefined) {
        allowedFields.carPlate = updateData.carPlate || null;
        console.log('Added carPlate:', updateData.carPlate);
      }
      if (updateData.familyMembers !== undefined && updateData.familyMembers !== '') {
        const familyMembersInt = parseInt(updateData.familyMembers);
        console.log('Family members conversion:', updateData.familyMembers, '->', familyMembersInt);
        if (!isNaN(familyMembersInt) && familyMembersInt > 0) {
          allowedFields.familyMembers = familyMembersInt;
          console.log('Added familyMembers:', familyMembersInt);
        }
      }
    }
    
    // Admin-specific fields
    if (type === 'admin') {
      console.log('Processing admin-specific fields');
      if (updateData.name !== undefined && updateData.name !== '') {
        allowedFields.name = updateData.name;
        console.log('Added name:', updateData.name);
      }
    }

    console.log('Final allowed fields:', JSON.stringify(allowedFields, null, 2));

    // Check if there are any fields to update
    if (Object.keys(allowedFields).length === 0) {
      console.log('ERROR: No valid fields to update');
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    console.log('Attempting database update...');
    let updatedUser;
    if (type === 'admin') {
      console.log('Updating admin with ID:', id);
      updatedUser = await prisma.admin.update({
        where: { id },
        data: allowedFields
      });
    } else {
      console.log('Updating resident with ID:', id);
      updatedUser = await prisma.resident.update({
        where: { id },
        data: allowedFields
      });
    }

    console.log('Database update successful');
    console.log('Updated user:', JSON.stringify(updatedUser, null, 2));

    const { passwordHash, ...userProfile } = updatedUser;
    console.log('Sending response:', JSON.stringify(userProfile, null, 2));
    console.log('=== UPDATE PROFILE DEBUG END ===');
    
    res.json(userProfile);
  } catch (error) {
    console.error('=== PROFILE UPDATE ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    console.error('=== ERROR END ===');
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Phone number or email already exists' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: error.message || 'Failed to update profile' });
  }
};