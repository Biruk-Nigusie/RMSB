import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    const superAdmin = await prisma.admin.create({
      data: {
        name: 'Super Admin',
        phone: '+251911111111',
        email: 'superadmin@rms.com',
        role: 'SUPER_ADMIN',
        passwordHash: hashedPassword
      }
    });

    console.log('Super Admin created:', superAdmin);
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();