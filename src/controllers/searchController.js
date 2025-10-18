import prisma from '../utils/db.js';

export const globalSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const [residents, groups, announcements] = await Promise.all([
      prisma.resident.findMany({
        where: {
          OR: [
            { fullName: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query } },
            { block: { contains: query, mode: 'insensitive' } },
            { houseNo: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: { id: true, fullName: true, phone: true, block: true, houseNo: true }
      }),
      prisma.ekubEddir.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        select: { id: true, name: true, type: true }
      }),
      prisma.announcement.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { message: { contains: query, mode: 'insensitive' } }
          ]
        },
        select: { id: true, title: true, createdAt: true }
      })
    ]);

    res.json({ residents, groups, announcements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};