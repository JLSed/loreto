'use server'

import { prisma } from '@/common/configs/prisma'

export async function getApartments(
  params = {
    page: 1,
    perPage: 10,
  }
) {
  return await prisma.apartment.findMany({
    skip: (params.page - 1) * params.perPage,
    take: params.perPage,
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function getAvailableApartments() {
  return prisma.apartment.findMany({
    where: { availability_status: 0 },
    select: { id: true, address: true, monthlyRentalPrice: true },
    orderBy: { address: 'asc' },
  })
}
