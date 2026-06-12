'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import {
  AuditAction,
  AuditAffectedTable,
  BoxOrderStatus,
} from '@/common/enums/enums.db'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

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

/**
 * The confirmation threshold status value.
 * Orders at or above this status are considered "confirmed" for inventory purposes.
 */
const CONFIRMATION_THRESHOLD = BoxOrderStatus.PaymentInfoConfirmed

/**
 * Updates a box order's status and automatically adjusts BoxInventory quantities
 * when crossing the confirmation threshold (PaymentInfoConfirmed).
 *
 * - Transitioning INTO confirmed (oldStatus < threshold, newStatus >= threshold):
 *   deducts order quantity from matching inventory.
 * - Transitioning OUT OF confirmed (oldStatus >= threshold, newStatus < threshold):
 *   restores order quantity to matching inventory.
 */
export async function updateOrderStatus(
  orderId: string,
  oldStatus: number,
  newStatus: number,
  forceDeduction: boolean = false
) {
  try {
    const session = await getServerSession(authOptions)

    const user = session?.user
    if (!user) return { status: 401, message: 'Unauthorized' }

    return await prisma.$transaction(async (tx) => {
      // Fetch the order with its box to get dimensions and quantity
      const order = await tx.boxOrder.findUniqueOrThrow({
        where: { id: orderId },
        include: { box: true },
      })

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

      // --- Inventory adjustment logic ---
      const isBecomingConfirmed =
        oldStatus < CONFIRMATION_THRESHOLD &&
        newStatus >= CONFIRMATION_THRESHOLD
      const isBecomingUnconfirmed =
        oldStatus >= CONFIRMATION_THRESHOLD &&
        newStatus < CONFIRMATION_THRESHOLD

      if (isBecomingConfirmed || isBecomingUnconfirmed) {
        const box = order.box
        const boxWidth = Math.round(
          box.totalWidth * (box.leftPanelSize / 100)
        )
        const boxLength = Math.round(
          box.totalWidth * (box.rightPanelSize / 100)
        )
        const boxHeight = Math.round(box.height)
        // Box model uses 1=single, 2=double; BoxInventory uses 0=single, 1=double
        const boxThickness = box.thickness - 1

        if (isBecomingConfirmed) {
          const deductionResult = await deductInventory(
            tx,
            {
              width: boxWidth,
              length: boxLength,
              height: boxHeight,
              thickness: boxThickness,
            },
            order.quantity,
            user.id,
            forceDeduction
          )

          if (deductionResult?.warning) {
            // Abort the transaction — Prisma rolls back on thrown error
            throw new InventoryWarningError(deductionResult.warning)
          }
        } else {
          await restoreInventory(
            tx,
            {
              width: boxWidth,
              length: boxLength,
              height: boxHeight,
              thickness: boxThickness,
            },
            order.quantity,
            user.id
          )
        }
      }

      revalidatePath('/dashboard/inventory')
      return { status: 200, message: 'Order status updated' }
    })
  } catch (error) {
    if (error instanceof InventoryWarningError) {
      return { status: 409, message: error.message }
    }
    console.log(error)
    return { status: 500, message: 'Internal server error' }
  }
}

// --- Inventory helper types and functions ---

/**
 * Custom error used to abort a Prisma transaction when a non-fatal
 * inventory warning needs to surface to the frontend.
 */
class InventoryWarningError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InventoryWarningError'
  }
}

interface BoxDimensions {
  width: number
  length: number
  height: number
  thickness: number
}

type PrismaTransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0]

/**
 * Retrieves or creates a default BoxType to use when creating new inventory entries.
 */
async function getOrCreateDefaultBoxType(
  tx: PrismaTransactionClient
): Promise<number> {
  const existing = await tx.boxType.findFirst({
    orderBy: { id: 'asc' },
  })
  if (existing) return existing.id

  const created = await tx.boxType.create({
    data: { typeName: 'General' },
  })
  return created.id
}

/**
 * Deducts the given quantity from matching BoxInventory entries.
 *
 * If no matching entries exist and `force` is false, returns a warning
 * instead of creating a deficit entry. If `force` is true, creates
 * a new entry with negative quantity to track the deficit.
 */
async function deductInventory(
  tx: PrismaTransactionClient,
  dimensions: BoxDimensions,
  quantityToDeduct: number,
  actorId: string,
  force: boolean
): Promise<{ warning: string } | undefined> {
  const matchingEntries = await tx.boxInventory.findMany({
    where: {
      width: dimensions.width,
      length: dimensions.length,
      height: dimensions.height,
      thickness: dimensions.thickness,
    },
    orderBy: { quantity: 'desc' },
  })

  if (matchingEntries.length > 0) {
    let remaining = quantityToDeduct

    for (const entry of matchingEntries) {
      if (remaining <= 0) break

      const deduction = Math.min(entry.quantity, remaining)
      const actualDeduction = deduction > 0 ? deduction : remaining

      const newQuantity = entry.quantity - actualDeduction
      const newTotalWeight = newQuantity * entry.weightPerPiece

      await tx.boxInventory.update({
        where: { id: entry.id },
        data: {
          quantity: newQuantity,
          TotalWeight: newTotalWeight,
        },
      })

      await tx.auditLog.create({
        data: {
          action: AuditAction.Modification,
          affectedTable: AuditAffectedTable.BoxInventory,
          affectedRowId: entry.id,
          remark: `Deducted ${actualDeduction} from inventory (order confirmed). ${dimensions.length}x${dimensions.width}x${dimensions.height}`,
          actorId,
          columnName: 'quantity',
          from: entry.quantity.toString(),
          to: newQuantity.toString(),
        },
      })

      remaining -= actualDeduction
    }

    return undefined
  }

  // No matching inventory found
  if (!force) {
    const thicknessLabel = dimensions.thickness === 0 ? 'Single' : 'Double'
    return {
      warning:
        `This box (${dimensions.length}x${dimensions.width}x${dimensions.height}, ${thicknessLabel}) ` +
        `does not exist in the inventory. Proceeding will create a negative quantity entry.`,
    }
  }

  // Force — create a deficit entry
  const boxTypeId = await getOrCreateDefaultBoxType(tx)
  const newQuantity = -quantityToDeduct

  const entry = await tx.boxInventory.create({
    data: {
      width: dimensions.width,
      length: dimensions.length,
      height: dimensions.height,
      thickness: dimensions.thickness,
      quantity: newQuantity,
      weightPerPiece: 1,
      TotalWeight: newQuantity,
      boxType: boxTypeId,
    },
  })

  await tx.auditLog.create({
    data: {
      action: AuditAction.Creation,
      affectedTable: AuditAffectedTable.BoxInventory,
      affectedRowId: entry.id,
      remark: `Created deficit inventory entry (qty: ${newQuantity}) from order confirmation. ${dimensions.length}x${dimensions.width}x${dimensions.height}`,
      actorId,
    },
  })

  return undefined
}

/**
 * Restores the given quantity to matching BoxInventory entries.
 * If no matching entries exist, creates a new entry with the restored quantity.
 */
async function restoreInventory(
  tx: PrismaTransactionClient,
  dimensions: BoxDimensions,
  quantityToRestore: number,
  actorId: string
): Promise<void> {
  const matchingEntries = await tx.boxInventory.findMany({
    where: {
      width: dimensions.width,
      length: dimensions.length,
      height: dimensions.height,
      thickness: dimensions.thickness,
    },
    orderBy: { quantity: 'asc' },
  })

  if (matchingEntries.length > 0) {
    // Restore to the first entry (lowest quantity, to replenish deficit first)
    const entry = matchingEntries[0]
    const newQuantity = entry.quantity + quantityToRestore
    const newTotalWeight = newQuantity * entry.weightPerPiece

    await tx.boxInventory.update({
      where: { id: entry.id },
      data: {
        quantity: newQuantity,
        TotalWeight: newTotalWeight,
      },
    })

    await tx.auditLog.create({
      data: {
        action: AuditAction.Modification,
        affectedTable: AuditAffectedTable.BoxInventory,
        affectedRowId: entry.id,
        remark: `Restored ${quantityToRestore} to inventory (order reverted/cancelled). ${dimensions.length}x${dimensions.width}x${dimensions.height}`,
        actorId,
        columnName: 'quantity',
        from: entry.quantity.toString(),
        to: newQuantity.toString(),
      },
    })
  } else {
    // No matching inventory — create a new entry with the restored quantity
    const boxTypeId = await getOrCreateDefaultBoxType(tx)

    const entry = await tx.boxInventory.create({
      data: {
        width: dimensions.width,
        length: dimensions.length,
        height: dimensions.height,
        thickness: dimensions.thickness,
        quantity: quantityToRestore,
        weightPerPiece: 1,
        TotalWeight: quantityToRestore,
        boxType: boxTypeId,
      },
    })

    await tx.auditLog.create({
      data: {
        action: AuditAction.Creation,
        affectedTable: AuditAffectedTable.BoxInventory,
        affectedRowId: entry.id,
        remark: `Created inventory entry (qty: ${quantityToRestore}) from order reversion. ${dimensions.length}x${dimensions.width}x${dimensions.height}`,
        actorId,
      },
    })
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
