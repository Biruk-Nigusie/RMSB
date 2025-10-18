import prisma from '../utils/db.js';

export const createAnnouncement = async (req, res) => {
  try {
    const { title, message, targetAudience } = req.body;
    
    const announcement = await prisma.announcement.create({
      data: {
        title,
        message,
        targetAudience,
        authorId: req.user.id
      },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    res.status(201).json({ message: 'Announcement created successfully', data: announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        author: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ data: announcements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true }
        }
      }
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json({ data: announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, targetAudience } = req.body;

    const announcement = await prisma.announcement.update({
      where: { id },
      data: { title, message, targetAudience }
    });

    res.json({ message: 'Announcement updated successfully', data: announcement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.announcement.delete({ where: { id } });
    
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};