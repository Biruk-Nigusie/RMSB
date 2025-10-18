import prisma from '../utils/db.js';

// Add notification table to schema first
export const createNotification = async (req, res) => {
  try {
    const { title, message, recipientId, type } = req.body;
    
    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        recipientId,
        type,
        senderId: req.user.id
      }
    });

    res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { recipientId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { name: true } }
      }
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};