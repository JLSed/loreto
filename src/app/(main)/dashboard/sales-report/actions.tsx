import { prisma } from '@/common/configs/prisma'

export async function getSalesReport() {
  const rent = await prisma.tenant.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      emailAddress: true,
      monthlyPayment: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const box = await prisma.boxOrder.findMany({
    where: { status: 7 },
    select: {
      id: true,
      createdAt: true,
      quantity: true,
      status: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      box: {
        select: {
          id: true,
          name: true,
          totalWidth: true,
          height: true,
          leftPanelSize: true,
          rightPanelSize: true,
          thickness: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const booking = await prisma.booking.findMany({
    where: { status: 4 },
    select: {
      id: true,
      createdAt: true,
      pickupDate: true,
      returnDate: true,
      booker: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      transaction: {
        select: {
          amount: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return { rent, box, booking }
}
