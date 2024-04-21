'use server'

import { prisma } from '@/common/configs/prisma'

export async function deleteVehicle(id: string) {
  return await prisma.vehicle.delete({ where: { id } })
}
