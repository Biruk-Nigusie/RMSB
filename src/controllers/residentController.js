import prisma from '../utils/db.js';

export const getAllResidents = async (req, res) => {
  try {
    const { block, ownershipType, status } = req.query;
    const where = {};
    
    if (block) where.block = block;
    if (ownershipType) where.ownershipType = ownershipType;
    if (status) where.status = status;

    const residents = await prisma.resident.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        block: true,
        houseNo: true,
        ownershipType: true,
        ownerName: true,
        familyMembers: true,
        carPlate: true,
        status: true,
        dateRegistered: true
      }
    });

    res.json(residents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const resident = await prisma.resident.findUnique({
      where: { id },
      include: {
        parkingSlots: true,
        utilities: true,
        complaints: true,
        groupMemberships: {
          include: { group: true }
        }
      }
    });

    if (!resident) {
      return res.status(404).json({ error: 'Resident not found' });
    }

    const { passwordHash, ...residentData } = resident;
    res.json(residentData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateResident = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    delete updateData.passwordHash;

    const resident = await prisma.resident.update({
      where: { id },
      data: updateData
    });

    const { passwordHash, ...residentData } = resident;
    res.json({ message: 'Resident updated successfully', resident: residentData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteResident = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.resident.delete({ where: { id } });
    
    res.json({ message: 'Resident deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};