'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { BookingStatusTexts } from '@/common/constants/business'
import {
  AuditAction,
  AuditAffectedTable,
  BookingStatus,
  BookStatus,
} from '@/common/enums/enums.db'
import { emailTransporter } from '@/common/services/email'
import { format } from 'date-fns'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

export async function getBookingById(id: string) {
  const data = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      booker: true,
      vehicle: true,
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
        include: { booker: true },
      })

      if (!old) {
        return { status: 404 }
      }

      const updated = await tx.booking.update({
        where: { id },
        data: { status },
      })

      const createSubject = (): string => {
        switch (updated.status) {
          case BookStatus.Cancelled:
            return `Your booking has been cancelled.`
          case BookStatus.Confirmed:
            return `Your booking has been confirmed.`
          case BookStatus.OnTheRoad:
            return `The vehicle is now arriving - Loreto`
          default:
            return `Your booking has been updated.`
        }
      }

      await emailTransporter.sendMail({
        from: 'noreply@loretotrading',
        sender: 'noreply@loretotrading',
        cc: ['eechemane29@gmail.com'],
        to: old.booker.email,
        subject: createSubject(),
        html: `
          <div style="margin: 2rem auto; max-width: 600px; padding: 1.5rem; font-family: sans-serif; border: 1px solid purple; border-radius: 2rem;">
            <h2>
              <strong>Dear ${old.booker.firstName},</strong>
            </h2>  

            <p> Your booking schedule on ${format(
              old.pickupDate,
              'dd MMMM yyyy'
            )} has been updated from ${
          BookingStatusTexts[old.status as BookingStatus]
        } to <strong>${
          BookingStatusTexts[updated.status as BookingStatus]
        }</strong>. Please see your bookings to view all details or click the button below. </p>

            <div>
              <a href="http://loreto.vercel.app/me/bookings">
                <button>See Details</button>
              </a>
            </div>

            <br/>
            <div>
              <div><strong>Best Regards,</strong></div>
              <div>Loreto Trading</div>
            </div>
          </div>
        `,
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
