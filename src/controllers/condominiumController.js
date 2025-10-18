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