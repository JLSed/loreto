'use server'

import { prisma } from '@/common/configs/prisma'

export async function getBookings(vehicleId?: string) {
  return prisma.booking.findMany({
    include: {
      booker: true,
      vehicle: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      vehicleId: vehicleId,
    },
  })
}
