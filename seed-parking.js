import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedParkingRequests() {
  try {
    // Get existing residents
    const residents = await prisma.resident.findMany({
      take: 3
    })

    if (residents.length === 0) {
      console.log('No residents found. Creating sample residents first...')
      
      // Create sample residents
      const sampleResidents = await Promise.all([
        prisma.resident.create({
          data: {
            fullName: 'John Doe',
            phone: '+251912345678',
            block: 'A',
            houseNo: '101',
            ownershipType: 'OWNED',
            familyMembers: 4,
            carPlate: 'AA-123456',
            passwordHash: '$2b$10$example',
            condominiumId: '550e8400-e29b-41d4-a716-446655440000'
          }
        }),
        prisma.resident.create({
          data: {
            fullName: 'Sarah Johnson',
            phone: '+251923456789',
            block: 'B',
            houseNo: '205',
            ownershipType: 'RENTED',
            familyMembers: 2,
            carPlate: 'BB-789012',
            passwordHash: '$2b$10$example',
            condominiumId: '550e8400-e29b-41d4-a716-446655440000'
          }
        }),
        prisma.resident.create({
          data: {
            fullName: 'Ahmed Ali',
            phone: '+251934567890',
            block: 'C',
            houseNo: '302',
            ownershipType: 'OWNED',
            familyMembers: 3,
            carPlate: 'CC-345678',
            passwordHash: '$2b$10$example',
            condominiumId: '550e8400-e29b-41d4-a716-446655440000'
          }
        })
      ])
      
      console.log('Created sample residents')
      
      // Create parking requests
      await Promise.all([
        prisma.parkingRequest.create({
          data: {
            residentId: sampleResidents[0].id,
            requestedSlot: 'P01',
            message: 'I have paid the monthly fee and need a parking spot for my car.',
            documentPath: 'payment_proof_001.pdf',
            status: 'PENDING'
          }
        }),
        prisma.parkingRequest.create({
          data: {
            residentId: sampleResidents[1].id,
            requestedSlot: 'P03',
            message: 'Telebirr payment completed. Please assign parking slot.',
            documentPath: 'telebirr_receipt_002.jpg',
            status: 'APPROVED',
            adminMessage: 'Approved. Slot P03 assigned.',
            processedAt: new Date()
          }
        }),
        prisma.parkingRequest.create({
          data: {
            residentId: sampleResidents[2].id,
            requestedSlot: 'P05',
            message: 'Need parking space for new vehicle. Payment attached.',
            documentPath: 'bank_transfer_003.pdf',
            status: 'PENDING'
          }
        })
      ])
    } else {
      // Create parking requests with existing residents
      await Promise.all([
        prisma.parkingRequest.create({
          data: {
            residentId: residents[0].id,
            requestedSlot: 'P01',
            message: 'I have paid the monthly fee and need a parking spot for my car.',
            documentPath: 'payment_proof_001.pdf',
            status: 'PENDING'
          }
        }),
        prisma.parkingRequest.create({
          data: {
            residentId: residents[1]?.id || residents[0].id,
            requestedSlot: 'P03',
            message: 'Telebirr payment completed. Please assign parking slot.',
            documentPath: 'telebirr_receipt_002.jpg',
            status: 'APPROVED',
            adminMessage: 'Approved. Slot P03 assigned.',
            processedAt: new Date()
          }
        })
      ])
    }

    console.log('Parking requests seeded successfully!')
  } catch (error) {
    console.error('Error seeding parking requests:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedParkingRequests()