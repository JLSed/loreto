'use server'

import { prisma } from '@/common/configs/prisma'

export async function getVehicleById(id: string) {
  return await prisma.vehicle.findUnique({
    where: {
      id: id,
    },
    include: {
      _count: {
        select: {
          Booking: true,
        },
      },
    },
  })
}
