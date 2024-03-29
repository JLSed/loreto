'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { createBooking, getVehicleById } from './booking-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Session } from 'next-auth'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { pesos } from '@/lib/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const BookInputSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, { message: 'Please fill out this field' }),
  lastName: z.string().trim().min(1, { message: 'Please fill out this field' }),
  contactNumber: z
    .string()
    .min(11, { message: 'Please enter a valid contact number' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  pickUpAddress: z
    .string()
    .trim()
    .min(10, { message: 'Please enter the complete pick up address' }),
  destination: z
    .string()
    .trim()
    .min(10, { message: 'Please enter the complete destination address' }),
  travelType: z.enum(['1', '2', '3'], {
    invalid_type_error: 'Please tell us the type of travel you want to book',
  }),
  pickUpDate: z.string().trim().min(10, 'Please select an exact pick up date'),
  vehicleId: z.string(),
})

export type VehicleBookingInput = z.infer<typeof BookInputSchema>

export default function BookingForm({
  v,
  user,
  vehicleId,
}: {
  v: Awaited<ReturnType<typeof getVehicleById>>
  user: Session['user']
  vehicleId: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<VehicleBookingInput>({
    disabled: isLoading,
    resolver: zodResolver(BookInputSchema),
    defaultValues: {
      email: user.email,
      vehicleId,
    },
  })
  const errors = form.formState.errors

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

  const onSubmit = async (data: VehicleBookingInput) => {
    try {
      setIsLoading(true)
      const res = await createBooking(data)
      if (res.status === 201) {
        toast('Booking successful', {
          description: 'We will contact you shortly to confirm your booking',
        })
        form.reset()
        router.back()
        router.refresh()
        return
      }

      toast.error('Something went wrong', {
        description: 'Please try again.',
      })
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className='px-4 grid-cols-[1.25fr_1fr] grid gap-5 my-5'>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Your basic information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-1'>
              <Label>First name</Label>
              <Input
                placeholder='Enter your first name'
                {...form.register('firstName')}
              />
              {errors.firstName && (
                <div className='text-xs text-red-600'>
                  {errors.firstName.message}
                </div>
              )}
            </div>
            <div className='space-y-1'>
              <Label>Family name</Label>
              <Input
                placeholder='Enter your family name'
                {...form.register('lastName')}
              />
              {errors.lastName && (
                <div className='text-xs text-red-600'>
                  {errors.lastName.message}
                </div>
              )}
            </div>
            <div className='space-y-1'>
              <Label>Contact number</Label>
              <Input
                placeholder='09 ...'
                {...form.register('contactNumber')}
              />
              {errors.contactNumber && (
                <div className='text-xs text-red-600'>
                  {errors.contactNumber.message}
                </div>
              )}
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
              <Textarea
                placeholder='Please tell us the complete address of the pick up point'
                {...form.register('pickUpAddress')}
              />
              {errors.pickUpAddress && (
                <div className='text-xs text-red-600'>
                  {errors.pickUpAddress.message}
                </div>
              )}
            </div>
            <div className='space-y-1'>
              <Label>Destination</Label>
              <Textarea
                placeholder='Please tell us the complete address of the destination'
                {...form.register('destination')}
              />
              {errors.destination && (
                <div className='text-xs text-red-600'>
                  {errors.destination.message}
                </div>
              )}
            </div>
            <div className='space-y-2'>
              <Label>Travel type</Label>
              <RadioGroup
                className='flex justify-between'
                {...form.register('travelType')}
              >
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
                  <Label htmlFor='r3'>Hourly</Label>
                </div>
              </RadioGroup>
              {errors.travelType && (
                <div className='text-xs text-red-600'>
                  {errors.travelType.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Schedule</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <Label>Pick up Date</Label>
              <Input
                className='w-auto'
                type='date'
                {...form.register('pickUpDate')}
              />
              {errors.pickUpDate && (
                <div className='text-xs text-red-600'>
                  {errors.pickUpDate.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className='py-4'>
          <Button
            type='submit'
            loading={isLoading}
            className='w-full'
          >
            Submit Booking
          </Button>
        </div>
      </form>

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
