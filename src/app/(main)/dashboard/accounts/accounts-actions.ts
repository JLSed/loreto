'use server'

import { prisma } from '@/common/configs/prisma'

export async function getAccountsForDashboard(
  params = { page: 1, perPage: 10 }
) {
  const users = await prisma.user.findMany({
    orderBy: {
      joinedAt: 'desc',
    },
    skip: (params.page - 1) * params.perPage,
    take: params.perPage,
  })

  return users
}
