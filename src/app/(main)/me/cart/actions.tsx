'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { BoxOrderStatus } from '@/common/enums/enums.db'
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

export async function placeOrder(params: {
  boxId: string
  contactNumber: string
  quantity: number
}) {
  const session = await getServerSession(authOptions)
  const user = session!.user

  try {
    return await prisma.$transaction(async (tx) => {
      const orderExists = await tx.boxOrder.findFirst({
        where: {
          userId: user.id,
          boxId: params.boxId,
          status: BoxOrderStatus.InCart,
        },
      })
      if (orderExists) {
        return {
          status: 400,
          message: 'You currently have an existing order of this box.',
        }
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          contactNumber: params.contactNumber,
        },
      })

      await tx.boxOrder.create({
        data: {
          boxId: params.boxId,
          userId: user.id,
          quantity: params.quantity,
          placedAt: new Date(),
        },
      })

      return { status: 201 }
    })
  } catch (error) {
    console.log('Error placing order', error)
    return { status: 500, message: 'An unknown error occurred' }
  }
}
