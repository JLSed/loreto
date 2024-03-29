'use server'

import { prisma } from '@/common/configs/prisma'
import { VehicleBookingInput } from './BookingForm'
import {
  ModeOfPayment,
  TransactionItemType,
  TransactionType,
} from '@/common/enums/enums.db'

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
