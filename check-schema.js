import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSchema() {
  try {
    // Check if profileImage column exists by trying to select it
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'residents' 
      AND column_name = 'profile_image';
    `;
    
    console.log('Profile image column exists:', result.length > 0);
    console.log('Result:', result);
    
    // Also check admin table
    const adminResult = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'admins' 
      AND column_name = 'profile_image';
    `;
    
    console.log('Admin profile image column exists:', adminResult.length > 0);
    console.log('Admin result:', adminResult);
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();