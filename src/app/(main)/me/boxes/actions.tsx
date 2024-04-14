'use server'

import { prisma } from '@/common/configs/prisma'

export async function getCustomerBoxes() {
  return prisma.box.findMany({
    include: {
      markings: true,
      imageMarkings: true,
    },
  })
}
