'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { BookingStatusTexts } from '@/common/constants/business'
import {
  AuditAction,
  AuditAffectedTable,
  BookingStatus,
} from '@/common/enums/enums.db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

export async function getBookingById(id: string) {
  const data = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      booker: true,
    },
  })

  if (!data) {
    notFound()
  }

  return data
}

export async function updateBookingStatus(id: string, status: number) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { status: 401 }
    }

    await prisma.$transaction(async (tx) => {
      const old = await tx.booking.findUnique({
        where: { id },
      })

      if (!old) {
        return { status: 404 }
      }

      const updated = await tx.booking.update({
        where: { id },
        data: { status },
      })

      await tx.auditLog.create({
        data: {
          action: AuditAction.Modification,
          affectedTable: AuditAffectedTable.Bookings,
          affectedRowId: updated.id,
          actorId: session.user.id,
          columnName: 'status',
          from: BookingStatusTexts[old.status as BookingStatus],
          to: BookingStatusTexts[updated.status as BookingStatus],
        },
      })
    })
    return { status: 201 }
  } catch (error) {
    return { status: 500 }
  }
}
