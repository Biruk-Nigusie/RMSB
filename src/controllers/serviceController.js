import prisma from '../utils/db.js';

export const createServiceProvider = async (req, res) => {
  try {
    const { name, serviceType, contact, feeMonthly } = req.body;
    
    const provider = await prisma.serviceProvider.create({
      data: { name, serviceType, contact, feeMonthly }
    });

    res.status(201).json({ message: 'Service provider created successfully', provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllServiceProviders = async (req, res) => {
  try {
    const providers = await prisma.serviceProvider.findMany({
      include: {
        _count: { select: { payments: true } }
      }
    });

    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const payServiceFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { month, amount } = req.body;

    const payment = await prisma.servicePayment.create({
      data: {
        providerId: id,
        residentId: req.user.id,
        month: new Date(month),
        amount,
        paymentStatus: 'PAID',
        paymentDate: new Date()
      }
    });

    res.status(201).json({ message: 'Service fee paid successfully', payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const rateProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const provider = await prisma.serviceProvider.update({
      where: { id },
      data: { rating }
    });

    res.json({ message: 'Provider rated successfully', provider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};