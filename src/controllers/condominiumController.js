import prisma from '../utils/db.js';

export const getAllCondominiums = async (req, res) => {
  try {
    const condominiums = await prisma.condominium.findMany({
      select: {
        id: true,
        name: true,
        location: true,
        totalBlocks: true
      },
      orderBy: { name: 'asc' }
    });

    res.json({ data: condominiums });
  } catch (error) {
    console.error('Get condominiums error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createCondominium = async (req, res) => {
  try {
    const { name, location, totalBlocks } = req.body;

    const condominium = await prisma.condominium.create({
      data: {
        name,
        location,
        totalBlocks: parseInt(totalBlocks)
      }
    });

    res.status(201).json({ data: condominium });
  } catch (error) {
    console.error('Create condominium error:', error);
    res.status(500).json({ error: error.message });
  }
};