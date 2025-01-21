'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { createBooking, getVehicleById } from './booking-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { pesos } from '@/lib/utils'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { User } from '@prisma/client'

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
  user: User
  vehicleId: string
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<VehicleBookingInput>({
    disabled: isLoading,
    resolver: zodResolver(BookInputSchema),
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      contactNumber: user.contactNumber ?? undefined,
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
          richColors: true,
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
              <Label>Hourly Rate</Label>
              <div>{pesos(v.serviceFeePerHour)}/Negotiable</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
