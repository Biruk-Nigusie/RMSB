import prisma from '../utils/db.js';

export const createParkingSlot = async (req, res) => {
  try {
    const { slotNo, feeMonthly } = req.body;
    const existingCount = await prisma.parkingSlot.count();
    
    const slot = await prisma.parkingSlot.create({
      data: {
        slotNo: slotNo || `P${String(existingCount + 1).padStart(2, '0')}`,
        feeMonthly: parseFloat(feeMonthly) || 500.0,
        isReserved: false,
        paymentStatus: 'PENDING'
      }
    });

    res.status(201).json({ message: 'Parking slot created successfully', slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllParkingSlots = async (req, res) => {
  try {
    const slots = await prisma.parkingSlot.findMany({
      include: {
        carOwner: {
          select: { fullName: true, phone: true }
        }
      }
    });

    // Transform to match frontend expectations
    const transformedSlots = slots.map(slot => ({
      id: slot.id,
      slotNumber: slot.slotNo,
      isOccupied: !!slot.carOwnerId,
      resident: slot.carOwner,
      price: slot.feeMonthly,
      monthlyFee: slot.feeMonthly,
      status: slot.carOwnerId ? 'OCCUPIED' : 'AVAILABLE',
      telebirrPhone: slot.telebirrPhone,
      qrCodePath: slot.qrCodePath
    }));

    res.json({ data: transformedSlots });
  } catch (error) {
    console.error('Get all parking slots error:', error);
    res.json({ data: [] });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const slots = await prisma.parkingSlot.findMany({
      where: { carOwnerId: null }
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignParkingSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { carOwnerId, carPlate } = req.body;

    const slot = await prisma.parkingSlot.update({
      where: { id },
      data: {
        carOwnerId,
        carPlate,
        isReserved: true
      },
      include: {
        carOwner: {
          select: { fullName: true }
        }
      }
    });

    res.json({ message: 'Parking slot assigned successfully', slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBulkSlots = async (req, res) => {
  try {
    const { count, price, telebirrPhone } = req.body;
    const qrCodeFile = req.file;
    const existingCount = await prisma.parkingSlot.count();
    
    const slots = [];
    for (let i = 1; i <= parseInt(count); i++) {
      slots.push({
        slotNo: `P${String(existingCount + i).padStart(2, '0')}`,
        feeMonthly: parseFloat(price) || 500.0,
        isReserved: false,
        paymentStatus: 'PENDING',
        telebirrPhone: telebirrPhone || null,
        qrCodePath: qrCodeFile ? qrCodeFile.filename : null
      });
    }
    
    await prisma.parkingSlot.createMany({ data: slots });
    
    res.status(201).json({ message: `${count} parking slots created successfully` });
  } catch (error) {
    console.error('Create bulk slots error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteParkingSlot = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.parkingSlot.delete({
      where: { id }
    });
    
    res.json({ message: 'Parking slot deleted successfully' });
  } catch (error) {
    console.error('Delete parking slot error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const requestParkingSlot = async (req, res) => {
  try {
    const { requestedSlot, message } = req.body;
    const userId = req.user?.id;
    const documentFile = req.file;
    
    if (!userId) {
      return res.status(401).json({ error: 'Please login to submit parking requests' });
    }
    
    // Check if user already has a pending request for this slot
    const existingRequest = await prisma.parkingRequest.findFirst({
      where: {
        residentId: userId,
        requestedSlot: requestedSlot,
        status: 'PENDING'
      }
    });
    
    if (existingRequest) {
      return res.status(400).json({ error: 'You already have a pending request for this slot' });
    }
    
    // Create parking request
    const request = await prisma.parkingRequest.create({
      data: {
        residentId: userId,
        requestedSlot: requestedSlot,
        message: message || null,
        documentPath: documentFile ? documentFile.filename : null,
        status: 'PENDING'
      }
    });
    
    res.status(201).json({ 
      message: 'Parking request submitted successfully',
      request: {
        id: request.id,
        slotNumber: request.requestedSlot,
        status: request.status,
        requestDate: request.createdAt
      }
    });
  } catch (error) {
    console.error('Request parking slot error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMyParkingRequests = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // Return empty array if no user (instead of error)
    if (!userId) {
      return res.json({ data: [] });
    }
    
    const requests = await prisma.parkingRequest.findMany({
      where: { residentId: userId },
      include: {
        parkingSlot: {
          select: { slotNo: true, feeMonthly: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const transformedRequests = requests.map(request => ({
      id: request.id,
      slotNumber: request.parkingSlot?.slotNo || request.requestedSlot,
      status: request.status,
      requestDate: request.createdAt,
      document: request.documentPath,
      message: request.message,
      adminMessage: request.adminMessage,
      monthlyFee: request.parkingSlot?.feeMonthly
    }));
    
    res.json({ data: transformedRequests });
  } catch (error) {
    console.error('Get my parking requests error:', error);
    res.json({ data: [] });
  }
};

export const getAllParkingRequests = async (req, res) => {
  try {
    // Get real parking requests from database
    const requests = await prisma.parkingRequest.findMany({
      include: {
        resident: {
          select: { fullName: true, phone: true, block: true, houseNo: true }
        },
        parkingSlot: {
          select: { slotNo: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const transformedRequests = requests.map(request => ({
      id: request.id,
      resident: request.resident,
      slotNumber: request.parkingSlot?.slotNo || request.requestedSlot,
      requestDate: request.createdAt,
      status: request.status,
      document: request.documentPath,
      message: request.message
    }));
    
    res.json({ data: transformedRequests });
  } catch (error) {
    console.error('Get all parking requests error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const approveParkingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    // Get the request details
    const request = await prisma.parkingRequest.findUnique({
      where: { id },
      include: { resident: true }
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Find available slot or use requested slot
    let assignedSlot = null;
    if (request.requestedSlot) {
      // Check if requested slot exists and is available
      assignedSlot = await prisma.parkingSlot.findFirst({
        where: {
          slotNo: request.requestedSlot,
          carOwnerId: null
        }
      });
    }
    
    if (!assignedSlot) {
      // Find any available slot
      assignedSlot = await prisma.parkingSlot.findFirst({
        where: { carOwnerId: null }
      });
    }
    
    if (!assignedSlot) {
      return res.status(400).json({ error: 'No available parking slots' });
    }
    
    // Assign slot to resident and update request
    await prisma.$transaction([
      prisma.parkingSlot.update({
        where: { id: assignedSlot.id },
        data: {
          carOwnerId: request.residentId,
          carPlate: request.resident.carPlate,
          isReserved: true
        }
      }),
      prisma.parkingRequest.update({
        where: { id },
        data: {
          status: 'APPROVED',
          slotId: assignedSlot.id,
          adminMessage: message || `Approved. Slot ${assignedSlot.slotNo} assigned.`,
          processedAt: new Date()
        }
      })
    ]);
    
    res.json({ message: 'Parking request approved and slot assigned successfully' });
  } catch (error) {
    console.error('Approve parking request error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const rejectParkingRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    // Update request status and add admin message
    await prisma.parkingRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        adminMessage: message || 'Request rejected',
        processedAt: new Date()
      }
    });
    
    res.json({ message: 'Parking request rejected successfully' });
  } catch (error) {
    console.error('Reject parking request error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const payParkingFee = async (req, res) => {
  try {
    const { slotId } = req.body;
    
    const slot = await prisma.parkingSlot.update({
      where: { id: slotId },
      data: {
        paymentStatus: 'PAID',
        datePaid: new Date()
      }
    });

    res.json({ message: 'Parking fee paid successfully', slot });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};