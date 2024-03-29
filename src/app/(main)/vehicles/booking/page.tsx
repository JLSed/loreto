import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { UserRole } from '@/common/enums/enums.db'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import BookingForm from './BookingForm'

export default async function Page(props: {
  searchParams: {
    vehicleId: string
  }
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (user?.role != UserRole.Customer) {
    redirect('/')
  }

  const v = await prisma.vehicle.findUnique({
    where: {
      id: props.searchParams.vehicleId,
    },
    include: {
      _count: {
        select: {
          Booking: true,
        },
      },
    },
  })

  return (
    <BookingForm
      v={v}
      user={user}
      vehicleId={props.searchParams.vehicleId}
    />
  )
}
