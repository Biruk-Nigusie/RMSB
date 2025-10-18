import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedMoreCondominiums() {
  try {
    const condominiums = [
      {
        name: 'Sunshine Heights',
        location: 'Bole, Addis Ababa',
        totalBlocks: 8
      },
      {
        name: 'Green Valley Residence',
        location: 'Kazanchis, Addis Ababa',
        totalBlocks: 12
      },
      {
        name: 'Royal Gardens',
        location: 'CMC, Addis Ababa',
        totalBlocks: 6
      },
      {
        name: 'Paradise Plaza',
        location: 'Megenagna, Addis Ababa',
        totalBlocks: 10
      }
    ]

    for (const condo of condominiums) {
      const existing = await prisma.condominium.findFirst({
        where: { name: condo.name }
      })
      
      if (!existing) {
        await prisma.condominium.create({
          data: condo
        })
        console.log(`Created condominium: ${condo.name}`)
      } else {
        console.log(`Condominium already exists: ${condo.name}`)
      }
    }

    console.log('Condominium seeding completed!')
  } catch (error) {
    console.error('Error seeding condominiums:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedMoreCondominiums()