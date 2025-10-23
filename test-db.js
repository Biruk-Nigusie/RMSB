import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test condominium exists
    const condominiums = await prisma.condominium.findMany();
    console.log('📍 Condominiums found:', condominiums.length);
    
    // Test admin exists
    const admins = await prisma.admin.findMany();
    console.log('👤 Admins found:', admins.length);
    
    console.log('🎉 Database is ready for registration/login');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();