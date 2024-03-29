import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import BookingStatusLabel from '@/components/shared/BookingStatusLabel'
import BookingTravelTypeLabel from '@/components/shared/BookingTravelTypeLabel'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { format } from 'date-fns'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/signin?redirect=/me/bookings')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      Bookings: {
        include: {
          vehicle: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/signin?redirect=/me/bookings')
  }

  return (
    <div>
      <header className='p-4'>
        <h3>Your bookings</h3>
      </header>

      <main className='p-4'>
        {user.Bookings.map((b) => {
          return (
            <Card key={b.id}>
              <CardHeader>
                <CardTitle className='flex items-center justify-between text-base'>
                  <div>{format(b.pickupDate, 'dd MMMM yyyy')}</div>
                  <BookingStatusLabel status={b.status} />
                </CardTitle>
                <CardDescription className='grid grid-cols-[100px_1fr] gap-2'>
                  <div>From:</div>
                  <div>{b.pickUpLocation}</div>

                  <div>To:</div>
                  <div>{b.destination}</div>

                  <div>Vehicle:</div>
                  <div>
                    {b.vehicle.name} - {b.vehicle.model}
                  </div>

                  <div>Type:</div>
                  <div>
                    <BookingTravelTypeLabel type={b.travelType} />
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Button
                    variant={'secondary'}
                    size={'sm'}
                  >
                    View details - Coming soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </main>
    </div>
  )
}
