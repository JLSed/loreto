'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

export async function getUserOrders() {
  const session = await getServerSession(authOptions)

  const user = session?.user

  if (!user) {
    notFound()
  }

  return await prisma.boxOrder.findMany({
    where: {
      userId: user.id,
    },
    include: {
      box: true,
      user: true,
    },
  })
}
