'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

export async function getCustomerBoxes(boxId?: string) {
  const session = await getServerSession(authOptions)

  if (!session) {
    notFound()
  }

  return prisma.box.findMany({
    where: {
      ownerId: session.user.id,
      id: boxId,
    },
    include: {
      markings: true,
      imageMarkings: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function deleteBox(boxId: string) {
  await prisma.box.delete({
    where: {
      id: boxId,
    },
  })
}
