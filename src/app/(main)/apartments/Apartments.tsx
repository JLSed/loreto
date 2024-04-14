'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Apartment } from '@prisma/client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckIcon } from '@radix-ui/react-icons'
import { pesos } from '@/lib/utils'

export default function Apartments(props: { apartments: Apartment[] }) {
  return (
    <div className='gap-8 grid-cols-2 grid'>
      {props.apartments.map((a) => {
        return (
          <Card
            key={a.id}
            className='overflow-hidden'
          >
            <CardContent className='px-0'>
              <div>
                <Carousel>
                  <CarouselContent>
                    {a.images.map((image, i) => {
                      return (
                        <CarouselItem
                          key={i}
                          className='relative aspect-video'
                        >
                          <Image
                            alt=''
                            src={image}
                            fill
                            className='object-cover'
                          />
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious className='left-2' />
                  <CarouselNext className='right-2' />
                </Carousel>
              </div>

              <div className='mt-8 space-y-2 px-8'>
                <div className='grid grid-cols-[15ch_1fr] items-center gap-2'>
                  <Label>Floor Area</Label>
                  <div>
                    {a.area} m<sup>2</sup>
                  </div>
                  <Label>Badrooms</Label>
                  <div>{a.bedrooms}</div>
                  <Label>Toilet and Bath</Label>
                  <div>{a.toiletAndBath}</div>
                  <Label>Can be occupied by</Label>
                  <div>{a.maxOccupantsPerUnit} persons</div>
                  <Label>Parking Spaces</Label>
                  <div className='flex gap-2'>
                    {a.withCarParkingSpace && (
                      <Badge variant={'secondary'}>
                        <CheckIcon className='mr-1' /> Car
                      </Badge>
                    )}
                    {a.withMotorcycleParkingSpace && (
                      <Badge variant={'secondary'}>
                        <CheckIcon className='mr-1' /> Motorcycle
                      </Badge>
                    )}
                  </div>
                  <Label>Monthly Rental Price</Label>
                  <div>{pesos(a.monthlyRentalPrice)}</div>
                  <Label>Address</Label>
                  <div className='text-sm'>{a.address}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
