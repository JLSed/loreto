import { prisma } from '@/common/configs/prisma'

export async function getSalesReport() {
  // Fetch all transactions with user info
  const transactions = await prisma.transaction.findMany({
    select: {
      id: true,
      createdAt: true,
      modifiedAt: true,
      modeOfPayment: true,
      type: true,
      itemType: true,
      amount: true,
      from: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Split transactions by itemType
  const rent = transactions.filter((t) => t.itemType === 3)
  const box = transactions.filter((t) => t.itemType === 1)
  const booking = transactions.filter((t) => t.itemType === 2)

  return { rent, box, booking }
}
