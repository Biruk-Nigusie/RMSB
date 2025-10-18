import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCondominium() {
  try {
    const condominiumId = '550e8400-e29b-41d4-a716-446655440000'
    
    // Check if condominium exists
    const existingCondominium = await prisma.condominium.findUnique({
      where: { id: condominiumId }
    })
    
    if (!existingCondominium) {
      // Create the condominium
      await prisma.condominium.create({
        data: {
          id: condominiumId,
          name: 'Default Condominium',
          location: 'Addis Ababa',
          totalBlocks: 10
        }
      })
      console.log('Default condominium created successfully')
    } else {
      console.log('Condominium already exists')
    }
  } catch (error) {
    console.error('Error seeding condominium:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCondominium()