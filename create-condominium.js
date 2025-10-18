import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCondominium() {
  try {
    const condominium = await prisma.condominium.create({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Sample Condominium',
        location: 'Addis Ababa',
        totalBlocks: 10
      }
    });

    console.log('Condominium created:', condominium);
  } catch (error) {
    console.error('Error creating condominium:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCondominium();