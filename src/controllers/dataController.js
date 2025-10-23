import prisma from '../utils/db.js';

export const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    let data;

    switch (type) {
      case 'residents':
        data = await prisma.resident.findMany();
        break;
      case 'admins':
        data = await prisma.admin.findMany();
        break;
      case 'condominiums':
        data = await prisma.condominium.findMany();
        break;
      case 'complaints':
        data = await prisma.complaint.findMany();
        break;
      case 'announcements':
        data = await prisma.announcement.findMany();
        break;
      case 'parking':
        data = await prisma.parkingSlot.findMany();
        break;
      case 'utilities':
        data = await prisma.utility.findMany();
        break;
      case 'audit_logs':
        data = await prisma.auditLog.findMany();
        break;
      case 'full_backup':
        data = {
          residents: await prisma.resident.findMany(),
          admins: await prisma.admin.findMany(),
          condominiums: await prisma.condominium.findMany(),
          complaints: await prisma.complaint.findMany(),
          announcements: await prisma.announcement.findMany(),
          parkingSlots: await prisma.parkingSlot.findMany(),
          utilities: await prisma.utility.findMany(),
          auditLogs: await prisma.auditLog.findMany()
        };
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type' });
    }

    res.json(data);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteData = async (req, res) => {
  try {
    const { type } = req.params;

    switch (type) {
      case 'residents':
        await prisma.resident.deleteMany();
        break;
      case 'admins':
        await prisma.admin.deleteMany();
        break;
      case 'condominiums':
        await prisma.condominium.deleteMany();
        break;
      case 'complaints':
        await prisma.complaint.deleteMany();
        break;
      case 'announcements':
        await prisma.announcement.deleteMany();
        break;
      case 'parking':
        await prisma.parkingSlot.deleteMany();
        break;
      case 'utilities':
        await prisma.utility.deleteMany();
        break;
      case 'audit_logs':
        await prisma.auditLog.deleteMany();
        break;
      case 'all_data':
        await prisma.auditLog.deleteMany();
        await prisma.utility.deleteMany();
        await prisma.parkingSlot.deleteMany();
        await prisma.announcement.deleteMany();
        await prisma.complaint.deleteMany();
        await prisma.resident.deleteMany();
        await prisma.admin.deleteMany();
        await prisma.condominium.deleteMany();
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type' });
    }

    res.json({ message: `${type} data deleted successfully` });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
};