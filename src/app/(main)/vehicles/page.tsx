import { prisma } from '@/common/configs/prisma'
import { VehicleStatusLabel } from '@/common/constants/business'
import { VehicleStatusColor } from '@/common/constants/status-colors'
import { VehicleStatus } from '@/common/enums/enums.db'
import StatusWithDot from '@/components/shared/StatusWithDot'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn, pesos } from '@/lib/utils'
import Image from 'next/image'
import MaterialIcon from '@/components/ui/material-icon'
import Link from 'next/link'

export default async function Page() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      status: 'desc',
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
    <main className='px-4'>
      <div className='mb-3'>Choose a vehicle</div>
      <div className='grid-cols-2 grid gap-5'>
        {vehicles.map((v) => {
          return (
            <Card
              key={v.id}
              className={cn({
                'dark:bg-neutral-900 transition':
                  v.status === VehicleStatus.Available,
                'opacity-75 shadow-none': v.status !== VehicleStatus.Available,
              })}
            >
              <CardHeader>
                <CardTitle className='capitalize text-base flex items-center justify-between'>
                  {v.name}
                  <StatusWithDot
                    label={VehicleStatusLabel[v.status as VehicleStatus]}
                    color={VehicleStatusColor[v.status as VehicleStatus]}
                  />
                </CardTitle>
                <CardDescription>{v.model}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='aspect-[6/4] relative'>
                  <Image
                    className='object-cover rounded-md'
                    src={v.photoUrl}
                    alt=''
                    fill
                  />
                </div>
                <div className='my-4 flex items-center justify-between'>
                  <div className='text-muted-foreground small'>
                    Service Fee per hour:
                  </div>
                  <div>{pesos(v.serviceFeePerHour)}</div>
                </div>
                <div className='small mb-4'>
                  Recently booked by {v._count.Booking} people
                </div>
                <Link href={`/vehicles/booking/?vehicleId=${v.id}`}>
                  <Button
                    className='w-full'
                    disabled={v.status !== VehicleStatus.Available}
                  >
                    {v.status !== VehicleStatus.Available ? (
                      'Not available'
                    ) : (
                      <>
                        <MaterialIcon
                          className='mr-2'
                          name='local_shipping'
                        />
                        <span>Book Now</span>
                      </>
                    )}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </main>
  )
}
