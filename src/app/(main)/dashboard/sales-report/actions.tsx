import { prisma } from '@/common/configs/prisma'

export async function getSalesReport() {
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
      tenant: {
        select: {
          firstName: true,
          lastName: true,
          emailAddress: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const rent = transactions
    .filter((t) => t.itemType === 3)
    .map((t) => ({
      ...t,
      from: t.tenant
        ? {
            firstName: t.tenant.firstName,
            lastName: t.tenant.lastName,
            email: t.tenant.emailAddress,
          }
        : undefined,
    }))
  const box = transactions.filter((t) => t.itemType === 1)
  const booking = transactions.filter((t) => t.itemType === 2)

  return { rent, box, booking }
}
