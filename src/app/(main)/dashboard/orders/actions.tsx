'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import {
  AuditAction,
  AuditAffectedTable,
  BoxOrderStatus,
} from '@/common/enums/enums.db'
import { getServerSession } from 'next-auth'

export async function getDashboardOrders() {
  return prisma.boxOrder.findMany({
    include: {
      box: {
        include: {
          markings: true,
          imageMarkings: true,
        },
      },
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function updateOrderStatus(
  orderId: string,
  oldStatus: number,
  newStatus: number
) {
  try {
    const session = await getServerSession(authOptions)

    const user = session?.user
    if (!user) return { status: 401, message: 'Unauthorized' }

    return await prisma.$transaction(async (tx) => {
      await tx.boxOrder.update({
        where: { id: orderId },
        data: {
          status: newStatus,
          receivedAt:
            newStatus === BoxOrderStatus.OrderReceived ? new Date() : null,
          cancelledAt:
            newStatus === BoxOrderStatus.cancelled ? new Date() : null,
          completedAt:
            newStatus === BoxOrderStatus.OrderCompleted ? new Date() : null,
          outForDeliveryAt:
            newStatus === BoxOrderStatus.OutForDelivery ? new Date() : null,
          paymentConfirmedAt:
            newStatus === BoxOrderStatus.PaymentInfoConfirmed
              ? new Date()
              : null,
          processingAt:
            newStatus === BoxOrderStatus.ProcessingOrder ? new Date() : null,
        },
      })

      await tx.auditLog.create({
        data: {
          action: AuditAction.Modification,
          affectedRowId: orderId,
          affectedTable: AuditAffectedTable.BoxOrder,
          actorId: user.id,
          columnName: 'status',
          from: oldStatus.toString(),
          to: newStatus.toString(),
        },
      })

      return { status: 200, message: 'Order status updated' }
    })
  } catch (error) {
    console.log(error)
    return { status: 500, message: 'Internal server error' }
  }
}

export async function createBoxOrderTransaction(order: any) {
  // You may want to adjust the order type for stricter typing
  return prisma.transaction.create({
    data: {
      modeOfPayment: 1, // Set as needed, or get from order/payment info
      type: 1, // 1: full payment
      itemType: 1, // 1: box
      amount: order.totalPrice, // Compute this as needed
      fromUserId: order.userId,
    },
  })
}
