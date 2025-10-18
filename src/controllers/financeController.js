import prisma from '../utils/db.js';

export const getFinancialSummary = async (req, res) => {
  try {
    const [parkingIncome, serviceIncome, utilityIncome] = await Promise.all([
      prisma.parkingSlot.aggregate({
        _sum: { feeMonthly: true },
        where: { paymentStatus: 'PAID' }
      }),
      prisma.servicePayment.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'PAID' }
      }),
      prisma.utility.aggregate({
        _sum: { billingAmount: true },
        where: { paymentStatus: 'PAID' }
      })
    ]);

    const totalIncome = (parkingIncome._sum.feeMonthly || 0) + 
                       (serviceIncome._sum.amount || 0) + 
                       (utilityIncome._sum.billingAmount || 0);

    const monthlyBreakdown = await prisma.servicePayment.groupBy({
      by: ['paymentDate'],
      _sum: { amount: true },
      where: { paymentStatus: 'PAID' }
    });

    res.json({
      totalIncome,
      breakdown: {
        parking: parkingIncome._sum.feeMonthly || 0,
        services: serviceIncome._sum.amount || 0,
        utilities: utilityIncome._sum.billingAmount || 0
      },
      monthlyBreakdown
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIncomeReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const where = {};
    if (startDate && endDate) {
      where.paymentDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const [parkingPayments, servicePayments] = await Promise.all([
      prisma.parkingSlot.findMany({
        where: { ...where, paymentStatus: 'PAID' },
        select: { feeMonthly: true, datePaid: true }
      }),
      prisma.servicePayment.findMany({
        where: { ...where, paymentStatus: 'PAID' },
        include: { provider: { select: { name: true, serviceType: true } } }
      })
    ]);

    res.json({ parkingPayments, servicePayments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};