import prisma from '../utils/db.js';

export const createUtilityBill = async (req, res) => {
  try {
    const { residentId, meterNo, serviceType, currentReading, previousReading, billingAmount, provider } = req.body;
    const usage = currentReading - previousReading;

    const utility = await prisma.utility.create({
      data: {
        residentId,
        meterNo,
        serviceType,
        currentReading,
        previousReading,
        usage,
        billingAmount,
        provider,
        paymentStatus: 'PENDING'
      }
    });

    res.status(201).json({ message: 'Utility bill created successfully', utility });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllUtilities = async (req, res) => {
  try {
    const utilities = await prisma.utility.findMany({
      include: {
        resident: { select: { fullName: true, block: true, houseNo: true } }
      }
    });

    res.json(utilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const payUtilityBill = async (req, res) => {
  try {
    const { id } = req.params;

    const utility = await prisma.utility.update({
      where: { id },
      data: { paymentStatus: 'PAID' }
    });

    res.json({ message: 'Utility bill paid successfully', utility });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reportUtilityIssue = async (req, res) => {
  try {
    const { utilityId, issue } = req.body;

    const utility = await prisma.utility.update({
      where: { id: utilityId },
      data: {
        reportIssue: issue,
        reportStatus: 'OPEN'
      }
    });

    res.json({ message: 'Issue reported successfully', utility });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resolveUtilityIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const utility = await prisma.utility.update({
      where: { id },
      data: { reportStatus: 'RESOLVED' }
    });

    res.json({ message: 'Issue resolved successfully', utility });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};