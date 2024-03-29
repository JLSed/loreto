'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { getVehicleById } from './booking-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Session } from 'next-auth'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { pesos } from '@/lib/utils'

export default function BookingForm({
  v,
  user,
}: {
  v: Awaited<ReturnType<typeof getVehicleById>>
  user: Session['user']
}) {
  if (!v) {
    return (
      <main>
        <header className='text-center'>
          <h3 className='my-5'>Vehicle not found</h3>
          <Link href='/vehicles'>
            <Button variant={'secondary'}>Back to Vehicles</Button>
          </Link>
        </header>
      </main>
    )
  }

  return (
    <main className='px-4 grid-cols-[1.25fr_1fr] grid gap-5 my-5'>
      <div className='space-y-4'>
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Your basic information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-1'>
              <Label>First name</Label>
              <Input placeholder='Enter your first name' />
            </div>
            <div className='space-y-1'>
              <Label>Family name</Label>
              <Input placeholder='Enter your family name' />
            </div>
            <div className='space-y-1'>
              <Label>Contact number</Label>
              <Input placeholder='Enter your active phone number' />
            </div>
            <div className='space-y-1'>
              <Label>Email address</Label>
              <Input
                disabled
                placeholder='Enter your email address'
                defaultValue={user.email}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Location</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-1'>
              <Label>Pick up address</Label>
              <Textarea placeholder='Please tell us the complete address of the pick up point' />
            </div>
            <div className='space-y-1'>
              <Label>Destination</Label>
              <Textarea placeholder='Please tell us the complete address of the destination' />
            </div>
            <div className='space-y-1'>
              <Label>Travel type</Label>
              <RadioGroup className='flex justify-between'>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem
                    value='1'
                    id='r1'
                  />
                  <Label htmlFor='r1'>One way</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem
                    value='2'
                    id='r2'
                  />
                  <Label htmlFor='r2'>Round trip</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem
                    value='3'
                    id='r3'
                  />
                  <Label htmlFor='r3'>Multiple trip</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <div className='py-4'>
          <Button className='w-full'>Submit Booking </Button>
        </div>
      </div>

      <div className='space-y-4'>
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>You are booking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='mb-4'>
              <div className='large'>
                {v.name} - {v?.model}
              </div>
            </div>
            <div className='relative aspect-[6/4] mb-4'>
              <Image
                className='object-cover rounded-md'
                src={v.photoUrl}
                alt=''
                fill
              />
            </div>
            <div className='muted'>
              Recently booked by {v._count.Booking} people
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Cost</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Label>Vehicle Service Fee per hour</Label>
              <div>{pesos(v.serviceFeePerHour)}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
