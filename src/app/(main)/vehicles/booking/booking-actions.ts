'use server'

import { prisma } from '@/common/configs/prisma'
import { VehicleBookingInput } from './BookingForm'
import {
  ModeOfPayment,
  TransactionItemType,
  TransactionType,
  UserRole,
} from '@/common/enums/enums.db'
import { authOptions } from '@/common/configs/auth'
import { getServerSession } from 'next-auth'
import { signOut } from 'next-auth/react'

export async function getVehicleById(id: string) {
  return await prisma.vehicle.findUnique({
    where: {
      id: id,
    },
    include: {
      _count: {
        select: {
          Booking: true,
        },
      },
    },
  })
}

export async function createBooking(input: VehicleBookingInput) {
  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: {
          email: input.email,
        },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          contactNumber: input.contactNumber,
        },
      })

      const transaction = await tx.transaction.create({
        data: {
          amount: 0,
          itemType: TransactionType.DownPayment,
          modeOfPayment: ModeOfPayment.Cash,
          fromUserId: user.id,
          type: TransactionItemType.Vehicle,
        },
      })

      await tx.booking.create({
        data: {
          vehicleId: input.vehicleId,
          bookerId: user.id,
          pickupDate: new Date(input.pickUpDate).toISOString(),
          pickUpLocation: input.pickUpAddress,
          destination: input.destination,
          travelType: +input.travelType,
          transactionId: transaction.id,
        },
      })
    })

    return { status: 201 }
  } catch (error) {
    console.error(error)
    return { status: 500 }
  }
}

export async function getCurrentCustomer() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    signOut({
      callbackUrl: '/',
    })
  }

  return prisma.user.findUnique({
    where: {
      email: session?.user.email,
      role: UserRole.Customer,
    },
  })
}
