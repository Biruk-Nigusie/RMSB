import prisma from '../utils/db.js';

export const getResidentDashboard = async (req, res) => {
  try {
    const residentId = req.user.id;

    const [complaints, parkingSlots, utilities, groupMemberships] = await Promise.all([
      prisma.complaint.count({ where: { residentId } }),
      prisma.parkingSlot.count({ where: { carOwnerId: residentId } }),
      prisma.utility.count({ where: { residentId, paymentStatus: 'PENDING' } }),
      prisma.ekubEddirMember.count({ where: { memberId: residentId, status: 'ACTIVE' } })
    ]);

    const recentAnnouncements = await prisma.announcement.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } }
    });

    res.json({
      stats: { complaints, parkingSlots, pendingBills: utilities, activeGroups: groupMemberships },
      recentAnnouncements
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const [totalResidents, totalComplaints, pendingComplaints, totalRevenue] = await Promise.all([
      prisma.resident.count(),
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'OPEN' } }),
      prisma.servicePayment.aggregate({ _sum: { amount: true }, where: { paymentStatus: 'PAID' } })
    ]);

    const recentComplaints = await prisma.complaint.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { resident: { select: { fullName: true, block: true } } }
    });

    res.json({
      stats: { totalResidents, totalComplaints, pendingComplaints, totalRevenue: totalRevenue._sum.amount || 0 },
      recentComplaints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSuperAdminDashboard = async (req, res) => {
  try {
    const [totalCondominiums, totalAdmins, totalResidents, systemStats] = await Promise.all([
      prisma.condominium.count(),
      prisma.admin.count(),
      prisma.resident.count(),
      prisma.auditLog.count()
    ]);

    const condominiumStats = await prisma.condominium.findMany({
      include: {
        _count: { select: { residents: true } }
      }
    });

    res.json({
      stats: { totalCondominiums, totalAdmins, totalResidents, totalAuditLogs: systemStats },
      condominiumStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};