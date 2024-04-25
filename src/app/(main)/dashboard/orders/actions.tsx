'use server'

import { prisma } from '@/common/configs/prisma'

export async function getDashboardOrders() {
  return prisma.boxOrder.findMany({
    include: {
      box: true,
      user: true,
    },
  })
}
