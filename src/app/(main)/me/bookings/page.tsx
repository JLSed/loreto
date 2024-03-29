import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import BookingStatusLabel from '@/components/shared/BookingStatusLabel'
import BookingTravelTypeLabel from '@/components/shared/BookingTravelTypeLabel'
import VehicleStatusLabelComponent from '@/components/shared/VehicleStatusLabel'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
import Image from 'next/image'
import Link from 'next/link'
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
        {user.Bookings.length === 0 && (
          <div className='lead space-y-4'>
            <div>{"You haven't made any bookings yet."}</div>
            <div>
              <Link href='/vehicles'>
                <Button>Book a vehicle</Button>
              </Link>
            </div>
          </div>
        )}

        {user.Bookings.length > 0 &&
          user.Bookings.map((b) => {
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
                  <Accordion
                    type='single'
                    collapsible
                    className='w-full'
                  >
                    <AccordionItem
                      value='item-1'
                      className='border-none'
                    >
                      <AccordionTrigger>View vehicle details</AccordionTrigger>
                      <AccordionContent className='flex gap-4 pt-4 items-start'>
                        <div className='relative aspect-[6/4] w-[300px]'>
                          <Image
                            fill
                            src={b.vehicle.photoUrl}
                            className='rounded-md'
                            alt=''
                          />
                        </div>
                        <div className='grid grid-cols-[150px_1fr] gap-3'>
                          <div className='text-muted-foreground'>Status:</div>
                          <div>
                            <VehicleStatusLabelComponent
                              status={b.vehicle.status}
                            />
                          </div>
                          <div className='text-muted-foreground'>
                            {'Last Maintenance:'}
                          </div>
                          <div>
                            {b.vehicle.lastMaintenance
                              ? format(
                                  b.vehicle.lastMaintenance,
                                  'dd MMMM yyyy'
                                )
                              : ''}
                          </div>
                          <div className='text-muted-foreground'>
                            {'Plate number:'}
                          </div>
                          <div>{b.vehicle.plateNumber}</div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            )
          })}
      </main>
    </div>
  )
}
