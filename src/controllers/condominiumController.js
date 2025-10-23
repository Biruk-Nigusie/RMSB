import prisma from '../utils/db.js';

export const getAllCondominiums = async (req, res) => {
  try {
    const condominiums = await prisma.condominium.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        totalBlocks: true,
        roomsPerFloor: true,
        floorsPerBlock: true,
        createdAt: true,
        _count: {
          select: {
            residents: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Get admin count for each condominium
    const condominiumsWithCounts = await Promise.all(
      condominiums.map(async (condo) => {
        const adminCount = await prisma.admin.count({
          where: { 
            OR: [
              { assignedCondominium: condo.name },
              { approvedCondominiums: { some: { id: condo.id } } }
            ]
          }
        });
        
        return {
          ...condo,
          totalResidents: condo._count.residents,
          totalAdmins: adminCount
        };
      })
    );

    res.json({ data: condominiumsWithCounts });
  } catch (error) {
    console.error('Get condominiums error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createCondominium = async (req, res) => {
  try {
    const { name, location, totalBlocks, roomsPerFloor, floorsPerBlock } = req.body;
    console.log('Creating condominium with data:', { name, location, totalBlocks, roomsPerFloor, floorsPerBlock });

    const condominium = await prisma.condominium.create({
      data: {
        name,
        location,
        totalBlocks: parseInt(totalBlocks),
        roomsPerFloor: roomsPerFloor ? parseInt(roomsPerFloor) : null,
        floorsPerBlock: floorsPerBlock ? parseInt(floorsPerBlock) : null
      }
    });

    console.log('Condominium created successfully:', condominium);
    res.status(201).json({ data: condominium });
  } catch (error) {
    console.error('Create condominium error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCondominium = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, totalBlocks, roomsPerFloor, floorsPerBlock } = req.body;

    // Update condominium
    const condominium = await prisma.condominium.update({
      where: { id },
      data: {
        name,
        location,
        totalBlocks: parseInt(totalBlocks),
        roomsPerFloor: roomsPerFloor ? parseInt(roomsPerFloor) : null,
        floorsPerBlock: floorsPerBlock ? parseInt(floorsPerBlock) : null
      }
    });

    // Update admin's assignedCondominium if there's an approvedBy admin
    if (condominium.approvedById) {
      await prisma.admin.update({
        where: { id: condominium.approvedById },
        data: { assignedCondominium: id }
      });
    }

    res.json({ data: condominium });
  } catch (error) {
    console.error('Update condominium error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCondominium = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.condominium.delete({
      where: { id }
    });

    res.json({ message: 'Condominium deleted successfully' });
  } catch (error) {
    console.error('Delete condominium error:', error);
    res.status(500).json({ error: error.message });
  }
};