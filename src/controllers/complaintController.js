import prisma from '../utils/db.js';

export const createComplaint = async (req, res) => {
  try {
    const { title, category, description, priority, photo } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Map frontend categories to database enum values
    const categoryMap = {
      'maintenance': 'MAINTENANCE',
      'noise': 'OTHER',
      'security': 'SECURITY', 
      'cleaning': 'OTHER',
      'parking': 'OTHER',
      'other': 'OTHER',
      'water': 'WATER',
      'electricity': 'ELECTRICITY',
      'theft': 'THEFT'
    };
    
    const complaint = await prisma.complaint.create({
      data: {
        category: categoryMap[category] || 'OTHER',
        description: title ? `${title}: ${description}` : description,
        photo,
        status: 'OPEN',
        residentId: req.user.id
      },
      include: {
        resident: {
          select: { fullName: true, phone: true }
        }
      }
    });

    res.status(201).json({ message: 'Complaint submitted successfully', data: complaint });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const { category, status } = req.query;
    const where = {};
    
    if (category) where.category = category;
    if (status) where.status = status;

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        resident: {
          select: { fullName: true, phone: true, block: true, houseNo: true }
        },
        assignedAdmin: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ data: complaints });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.json({ data: [] });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    // Use first resident ID if no auth for testing
    let userId = req.user?.id;
    if (!userId) {
      const firstResident = await prisma.resident.findFirst();
      userId = firstResident?.id;
    }

    if (!userId) {
      return res.json({ data: [] });
    }

    const complaints = await prisma.complaint.findMany({
      where: { residentId: userId },
      include: {
        assignedAdmin: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ data: complaints });
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.json({ data: [] });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedAdminId, title, description, category } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (assignedAdminId) updateData.assignedAdminId = assignedAdminId;
    if (title || description) {
      updateData.description = title ? `${title}: ${description}` : description;
    }
    if (category) {
      const categoryMap = {
        'maintenance': 'MAINTENANCE',
        'noise': 'OTHER',
        'security': 'SECURITY', 
        'cleaning': 'OTHER',
        'parking': 'OTHER',
        'other': 'OTHER',
        'water': 'WATER',
        'electricity': 'ELECTRICITY',
        'theft': 'THEFT'
      };
      updateData.category = categoryMap[category] || 'OTHER';
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: updateData,
      include: {
        resident: {
          select: { fullName: true }
        },
        assignedAdmin: {
          select: { name: true }
        }
      }
    });

    res.json({ message: 'Complaint updated successfully', data: complaint });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.complaint.delete({ where: { id } });
    
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ error: error.message });
  }
};