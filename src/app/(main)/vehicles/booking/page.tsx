import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import BookingForm from './BookingForm'
import { getCurrentCustomer } from './booking-actions'
import { BookingStatus } from '@/common/enums/enums.db'

export default async function Page(props: {
  searchParams: Promise<{
    vehicleId: string
  }>
}) {
  const searchParams = await props.searchParams
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(
      encodeURI(
        `/?open=1&redirect=/vehicles/booking?vehicleId=${searchParams.vehicleId}`
      )
    )
  }

  const [user, v, bookings] = await Promise.all([
    getCurrentCustomer(),
    prisma.vehicle.findUnique({
      where: {
        id: searchParams.vehicleId,
      },
      include: {
        _count: {
          select: {
            Booking: true,
          },
        },
      },
    }),
    prisma.booking.findMany({
      orderBy: {
        pickupDate: 'desc',
      },
      where: {
        vehicleId: searchParams.vehicleId,
        status: BookingStatus.Confirmed,
      },
    }),
  ])

  return (
    <BookingForm
      v={v}
      user={user!}
      vehicleId={searchParams.vehicleId}
      bookings={bookings}
    />
  )
}
