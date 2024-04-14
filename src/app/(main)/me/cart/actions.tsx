'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'

export async function getCustomerCartItems() {
  const session = await getServerSession(authOptions)
  const user = session!.user

  return prisma.box.findMany({
    where: {
      id: user.id,
    },
  })
}
