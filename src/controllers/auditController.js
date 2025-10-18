import prisma from '../utils/db.js';

export const createAuditLog = async (actorId, actorType, action, targetTable, ipAddress = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        actorId,
        actorType,
        action,
        targetTable,
        ipAddress
      }
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
};

export const getAllAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const logs = await prisma.auditLog.findMany({
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { timestamp: 'desc' },
      include: {
        admin: { select: { name: true } },
        resident: { select: { fullName: true } }
      }
    });

    const total = await prisma.auditLog.count();

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const clearAuditLogs = async (req, res) => {
  try {
    await prisma.auditLog.deleteMany({});
    res.json({ message: 'Audit logs cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};