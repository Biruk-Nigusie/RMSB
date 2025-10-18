import prisma from '../utils/db.js';

export const createGroup = async (req, res) => {
  try {
    const { name, type, monthlyContribution, maxMembers, description, telebirrPhone } = req.body;
    const qrCodeFile = req.file;
    const userId = req.user?.id;
    
    console.log('Creating group with file:', qrCodeFile ? qrCodeFile.filename : 'No file');
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    if (!qrCodeFile) {
      return res.status(400).json({ error: 'QR code file is required' });
    }
    
    const group = await prisma.ekubEddir.create({
      data: {
        name,
        type,
        adminId: userId,
        monthlyContribution: parseFloat(monthlyContribution),
        paymentMethod: 'TELEBIRR',
        telebirrPhone: telebirrPhone,
        qrCodePath: qrCodeFile.filename
      }
    });

    console.log('Group created with QR path:', qrCodeFile.filename);
    res.status(201).json({ message: 'Group created successfully', data: group });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    const groups = await prisma.ekubEddir.findMany({
      include: {
        admin: {
          select: { fullName: true, id: true }
        },
        currentWinner: {
          select: { fullName: true, id: true }
        },
        members: {
          include: {
            member: {
              select: { fullName: true, id: true }
            }
          }
        },
        payments: {
          where: {
            paymentDate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          },
          include: {
            member: {
              select: { id: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const transformedGroups = groups.map(group => {
      const isAdmin = group.adminId === userId;
      const isMember = group.members.some(member => member.memberId === userId);
      const paidMemberIds = group.payments.map(payment => payment.memberId);
      
      return {
        id: group.id,
        name: group.name,
        type: group.type,
        monthlyContribution: group.monthlyContribution,
        totalMembers: group.members.length,
        currentRound: 1,
        admin: group.admin,
        status: 'ACTIVE',
        isAdmin,
        isMember,
        paymentMethod: group.paymentMethod,
        telebirrPhone: group.telebirrPhone,
        qrCodePath: group.qrCodePath,
        currentWinner: group.currentWinner,
        lastWinnerDate: group.lastWinnerDate,
        nextPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        members: group.members.map(member => ({
          id: member.member.id,
          name: member.member.fullName,
          hasPaid: paidMemberIds.includes(member.memberId),
          hasWon: false
        })),
        joinRequests: []
      };
    });

    res.json({ data: transformedGroups });
  } catch (error) {
    console.error('Get groups error:', error);
    res.json({ data: [] });
  }
};

export const addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    const member = await prisma.ekubEddirMember.create({
      data: {
        groupId: id,
        memberId
      },
      include: {
        member: { select: { fullName: true, phone: true } }
      }
    });

    res.status(201).json({ message: 'Member added successfully', member });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requestJoin = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Check if already a member
    const existingMember = await prisma.ekubEddirMember.findFirst({
      where: { groupId: id, memberId: userId }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'Already a member or request pending' });
    }

    // Add member directly (simplified for now)
    const member = await prisma.ekubEddirMember.create({
      data: {
        groupId: id,
        memberId: userId,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({ message: 'Successfully joined group', data: member });
  } catch (error) {
    console.error('Join request error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const approveJoinRequest = async (req, res) => {
  try {
    const { id, requestId } = req.params;

    await prisma.ekubEddirMember.update({
      where: { id: requestId },
      data: { status: 'ACTIVE' }
    });

    res.json({ message: 'Member approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const selectRandomWinner = async (req, res) => {
  try {
    const { id } = req.params;

    // Get eligible members (active, paid this month)
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const eligibleMembers = await prisma.ekubEddirMember.findMany({
      where: {
        groupId: id,
        status: 'ACTIVE'
      },
      include: {
        member: { 
          select: { fullName: true, id: true },
          include: {
            groupPayments: {
              where: {
                groupId: id,
                paymentDate: {
                  gte: startOfMonth
                }
              }
            }
          }
        }
      }
    });

    // Filter members who have paid this month
    const paidMembers = eligibleMembers.filter(member => 
      member.member.groupPayments && member.member.groupPayments.length > 0
    );

    if (paidMembers.length === 0) {
      return res.status(400).json({ error: 'No eligible members (must have paid this month)' });
    }

    // Select random winner
    const randomIndex = Math.floor(Math.random() * paidMembers.length);
    const winner = paidMembers[randomIndex];

    // Update group with current winner
    await prisma.ekubEddir.update({
      where: { id },
      data: { 
        currentWinnerId: winner.memberId,
        lastWinnerDate: new Date()
      }
    });

    res.json({ 
      message: 'Winner selected successfully!', 
      winner: winner.member.fullName,
      data: {
        winnerId: winner.memberId,
        winnerName: winner.member.fullName,
        selectedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Select winner error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const sendPaymentReminder = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current month payments
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    // Get all active members
    const allMembers = await prisma.ekubEddirMember.findMany({
      where: {
        groupId: id,
        status: 'ACTIVE'
      },
      include: {
        member: { 
          select: { fullName: true, phone: true, id: true },
          include: {
            groupPayments: {
              where: {
                groupId: id,
                paymentDate: {
                  gte: startOfMonth
                }
              }
            }
          }
        }
      }
    });

    // Filter unpaid members
    const unpaidMembers = allMembers.filter(member => 
      !member.member.groupPayments || member.member.groupPayments.length === 0
    );

    // Create notifications for unpaid members
    const notifications = unpaidMembers.map(member => ({
      title: 'Payment Reminder',
      message: `Please make your monthly contribution for the group.`,
      recipientId: member.memberId,
      senderId: req.user?.id || 'system',
      type: 'PAYMENT_REMINDER'
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications
      });
    }
    
    res.json({ 
      message: `Payment reminders sent to ${unpaidMembers.length} members`,
      unpaidCount: unpaidMembers.length,
      totalMembers: allMembers.length
    });
  } catch (error) {
    console.error('Send reminder error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const sendGroupAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    // Get all group members
    const members = await prisma.ekubEddirMember.findMany({
      where: { groupId: id, status: 'ACTIVE' },
      include: {
        member: { select: { fullName: true } }
      }
    });

    // Send announcement to all members (mock implementation)
    // In real implementation, create notifications or send messages

    res.json({ message: `Announcement sent to ${members.length} members` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, method, roundNo } = req.body;
    const proofFile = req.file;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const payment = await prisma.ekubEddirPayment.create({
      data: {
        groupId: id,
        memberId: userId,
        amount: parseFloat(amount),
        method: 'TELEBIRR',
        roundNo: parseInt(roundNo) || 1,
        proofPath: proofFile ? proofFile.filename : null
      }
    });

    res.status(201).json({ message: 'Payment recorded successfully', data: payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const payments = await prisma.ekubEddirPayment.findMany({
      where: { groupId: id },
      include: {
        member: { select: { fullName: true } }
      },
      orderBy: { paymentDate: 'desc' }
    });

    res.json({ data: payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGroupMembers = async (req, res) => {
  try {
    const { id } = req.params;

    const members = await prisma.ekubEddirMember.findMany({
      where: { groupId: id, status: 'ACTIVE' },
      include: {
        member: { select: { fullName: true, phone: true } }
      }
    });

    res.json({ data: members });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJoinRequests = async (req, res) => {
  try {
    const { id } = req.params;

    const requests = await prisma.ekubEddirMember.findMany({
      where: { groupId: id, status: 'PENDING' },
      include: {
        member: { select: { fullName: true } }
      },
      orderBy: { joinDate: 'desc' }
    });

    res.json({ data: requests });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};