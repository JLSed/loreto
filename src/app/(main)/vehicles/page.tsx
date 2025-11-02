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
    <main className='px-4 max-w-6xl mx-auto py-6'>
      <div className='mb-8 space-y-2 animate-in slide-in-from-top duration-500'>
        <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'>
          Choose Your Vehicle
        </h1>
        <p className='text-muted-foreground'>
          Select from our premium fleet for your transportation needs
        </p>
      </div>
      <div className='grid-cols-1 md:grid-cols-2 grid gap-6 animate-in fade-in duration-500 delay-200'>
        {vehicles.map((v, index) => {
          return (
            <Card
              key={v.id}
              className={cn(
                'hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1',
                {
                  'bg-gradient-to-br from-background to-accent':
                    v.status === VehicleStatus.Available,
                  'opacity-75 shadow-none bg-muted':
                    v.status !== VehicleStatus.Available,
                }
              )}
              style={{ animationDelay: `${index * 100}ms` }}
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
                <div className='aspect-[6/4] relative overflow-hidden rounded-lg'>
                  <Image
                    className='object-cover transition-transform duration-300 hover:scale-105'
                    src={v.photoUrl}
                    alt={`${v.name} - ${v.model}`}
                    fill
                  />
                  <div className='absolute top-2 right-2'>
                    <div className='bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-foreground'>
                      {v.model}
                    </div>
                  </div>
                </div>
                <div className='my-4 flex items-center justify-between p-3 bg-muted rounded-lg'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Hourly rate:
                  </div>
                  <div className='font-bold text-green-600'>
                    {pesos(v.serviceFeePerHour)}/Negotiable
                  </div>
                </div>
                <div className='text-sm mb-4 text-muted-foreground flex items-center gap-1'>
                  <div className='w-2 h-2 bg-primary rounded-full'></div>
                  Recently booked by {v._count.Booking} people
                </div>
                <Link href={`/vehicles/booking/?vehicleId=${v.id}`}>
                  <Button
                    className={cn(
                      'w-full transition-all duration-300',
                      v.status === VehicleStatus.Available
                        ? 'bg-gradient-to-r from-red-500 to-primary hover:from-primary hover:to-primary/80 text-primary-foreground shadow-md hover:shadow-lg'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    )}
                    disabled={v.status !== VehicleStatus.Available}
                  >
                    {v.status !== VehicleStatus.Available ? (
                      'Not Available'
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
