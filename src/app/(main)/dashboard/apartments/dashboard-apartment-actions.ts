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
  })
}
