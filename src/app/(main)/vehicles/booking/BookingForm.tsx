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
import { Booking, User } from '@prisma/client'
import BookingDatePicker from './BookingDatePicker'
import { formatDate } from 'date-fns'
import usePhAddressQuery from '@/common/hooks/usePhAddressQuery'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
  bookings,
}: {
  v: Awaited<ReturnType<typeof getVehicleById>>
  user: User
  vehicleId: string
  bookings: Booking[]
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

  const pickupLocationCtrl = usePhAddressQuery({
    onFullAddressChange(fullAddress) {
      form.setValue('pickUpAddress', fullAddress, {
        shouldDirty: true,
        shouldTouch: true,
      })
    },
  })

  const destinationCtrl = usePhAddressQuery({
    onFullAddressChange(fullAddress) {
      form.setValue('destination', fullAddress, {
        shouldDirty: true,
        shouldTouch: true,
      })
    },
  })

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

  function hanldePickUpdatePick(date: Date): void {
    form.setValue('pickUpDate', date.toString(), {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    })
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
              <div className='grid grid-cols-[min-content_1fr] gap-3 items-center'>
                <div className='text-muted-foreground text-sm'>Region</div>
                <Select
                  disabled={pickupLocationCtrl.regionsQuery.isPending}
                  value={pickupLocationCtrl.selectedRegion?.code}
                  onValueChange={pickupLocationCtrl.setRegionByCode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Region' />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocationCtrl.regions.map((r) => (
                      <SelectItem
                        value={r.code}
                        key={r.code}
                      >
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='text-muted-foreground text-sm'>City</div>
                <Select
                  disabled={pickupLocationCtrl.citiesQuery.isPending}
                  value={pickupLocationCtrl.selectedCity?.code}
                  onValueChange={pickupLocationCtrl.setCityByCode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select City' />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocationCtrl.cities.map((c) => (
                      <SelectItem
                        value={c.code}
                        key={c.code}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='text-muted-foreground text-sm'>Brgy.</div>
                <Select
                  disabled={pickupLocationCtrl.brgysQuery.isPending}
                  value={pickupLocationCtrl.selectedBarangay?.code}
                  onValueChange={pickupLocationCtrl.setBrgyByCode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Brgy.' />
                  </SelectTrigger>
                  <SelectContent>
                    {pickupLocationCtrl.barangays.map((b) => (
                      <SelectItem
                        value={b.code}
                        key={b.code}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='text-muted-foreground text-sm'>
                  Subdivision/Village
                </div>
                <Input
                  placeholder='Subdivision/Village'
                  value={pickupLocationCtrl.subdivisionOrVillage}
                  onChange={(e) =>
                    pickupLocationCtrl.setSubdivisionOrVillage(e.target.value)
                  }
                />

                <div className='text-muted-foreground text-sm'>
                  Street/Building
                </div>
                <Input
                  placeholder='Street/Building'
                  value={pickupLocationCtrl.streetOrBuilding}
                  onChange={(e) =>
                    pickupLocationCtrl.setStreetOrBuilding(e.target.value)
                  }
                />

                <div className='text-muted-foreground text-sm'>
                  Lot/Block/Unit No:
                </div>
                <Input
                  placeholder='Lot/Block/Unit No:'
                  value={pickupLocationCtrl.lotOrUnitNumber}
                  onChange={(e) =>
                    pickupLocationCtrl.setLotOrUnitNumber(e.target.value)
                  }
                />
              </div>

              {errors.pickUpAddress && (
                <div className='text-xs text-red-600'>
                  {errors.pickUpAddress.message}
                </div>
              )}
            </div>
            <div className='space-y-1'>
              <Label>Destination</Label>
              <div className='grid grid-cols-[min-content_1fr] gap-3 items-center'>
                <div className='text-muted-foreground text-sm'>Region</div>
                <Select
                  disabled={destinationCtrl.regionsQuery.isPending}
                  value={destinationCtrl.selectedRegion?.code}
                  onValueChange={destinationCtrl.setRegionByCode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Region' />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationCtrl.regions.map((r) => (
                      <SelectItem
                        value={r.code}
                        key={r.code}
                      >
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='text-muted-foreground text-sm'>City</div>
                <Select
                  disabled={destinationCtrl.citiesQuery.isPending}
                  value={destinationCtrl.selectedCity?.code}
                  onValueChange={destinationCtrl.setCityByCode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select City' />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationCtrl.cities.map((c) => (
                      <SelectItem
                        value={c.code}
                        key={c.code}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='text-muted-foreground text-sm'>Brgy.</div>
                <Select
                  disabled={destinationCtrl.brgysQuery.isPending}
                  value={destinationCtrl.selectedBarangay?.code}
                  onValueChange={destinationCtrl.setBrgyByCode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select Brgy.' />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationCtrl.barangays.map((b) => (
                      <SelectItem
                        value={b.code}
                        key={b.code}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='text-muted-foreground text-sm'>
                  Subdivision/Village
                </div>
                <Input
                  placeholder='Subdivision/Village'
                  value={destinationCtrl.subdivisionOrVillage}
                  onChange={(e) =>
                    destinationCtrl.setSubdivisionOrVillage(e.target.value)
                  }
                />

                <div className='text-muted-foreground text-sm'>
                  Street/Building
                </div>
                <Input
                  placeholder='Street/Building'
                  value={destinationCtrl.streetOrBuilding}
                  onChange={(e) =>
                    destinationCtrl.setStreetOrBuilding(e.target.value)
                  }
                />

                <div className='text-muted-foreground text-sm'>
                  Lot/Block/Unit No:
                </div>
                <Input
                  placeholder='Lot/Block/Unit No:'
                  value={destinationCtrl.lotOrUnitNumber}
                  onChange={(e) =>
                    destinationCtrl.setLotOrUnitNumber(e.target.value)
                  }
                />
              </div>
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

              <BookingDatePicker
                bookings={bookings}
                onPick={hanldePickUpdatePick}
                pickedDate={form.watch('pickUpDate')}
              />
              {form.watch('pickUpDate') && (
                <div>
                  You picked:{' '}
                  <strong>
                    {formatDate(form.watch('pickUpDate'), 'MMMM d, yyyy')}
                  </strong>
                </div>
              )}

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
