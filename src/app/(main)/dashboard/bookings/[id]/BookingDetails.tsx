'use client'

import { BookingStatusTexts } from '@/common/constants/business'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getBookingById, updateBookingStatus } from './actions'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import BookingStatusLabel from '@/components/shared/BookingStatusLabel'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { format, set } from 'date-fns'
import Link from 'next/link'
import { DatePicker } from '@/components/shared/DatePicker'

type Booking = Awaited<ReturnType<typeof getBookingById>>

export default function BookingDetails({ data }: { data: Booking }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(data.status)
  const [returnDate, setReturnDate] = useState<Date | undefined>(
    data.returnDate ? new Date(data.returnDate) : undefined
  )
  const router = useRouter()
  async function save() {
    try {
      setLoading(true)
      console.log({ returnDate })
      const res = await updateBookingStatus(data.id, status, returnDate)
      if (res.status === 201) {
        toast.success('Status and return date updated successfully', {
          richColors: true,
        })
        router.back()
        router.refresh()
        return
      }

      toast.error('Failed to update status. Please try again.')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='max-w-3xl m-auto grid grid-cols-[1.5fr_1fr] gap-4'>
      <div className='rounded-md border p-6'>
        <div className='font-bold mb-4'>Details</div>
        <div className='grid grid-cols-2 gap-4'>
          <div>Pickup Date:</div>
          <div>{format(data.pickupDate, 'dd MMMM yyyy')}</div>
          <div>Pickup Location:</div>
          <div>{data.pickUpLocation}</div>
          <div>Destination:</div>
          <div>{data.destination}</div>
          <div>Booked on:</div>
          <div>{format(data.createdAt, 'dd MMMM yyyy')}</div>
          <div>Booked by:</div>
          <div>{`${data.booker.firstName} ${data.booker.lastName}`}</div>
          <div>Vehicle:</div>
          <div>{data.vehicle.name}</div>
        </div>
      </div>
      <div>
        <Card className='shadow-none'>
          <CardHeader>
            <CardTitle className='text-base'>Update status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-1'>
              <Label>Status</Label>
              <Select
                disabled={loading}
                defaultValue={data.status.toString()}
                onValueChange={(value) => {
                  setStatus(+value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(BookingStatusTexts).map(([key, value]) => (
                    <SelectItem
                      key={key}
                      value={key}
                    >
                      <BookingStatusLabel status={+key} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1 mt-4'>
              <Label>Return Date</Label>
              <DatePicker
                defaultDate={returnDate}
                onSelect={setReturnDate}
                disabled={status !== 4}
                minDate={new Date(data.pickupDate)}
              />
            </div>
            <div className='mt-8 flex justify-end'>
              <Button
                loading={loading}
                onClick={save}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className='mt-4'>
          <Link
            target='_blank'
            href={`/dashboard/bookings/calendar?vehicleId=${data.vehicleId}&bookingId=${data.id}`}
          >
            <Button
              variant={'outline'}
              className='w-full'
            >
              View Calendar
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
