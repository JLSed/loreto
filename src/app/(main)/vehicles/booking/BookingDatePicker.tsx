'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Booking } from '@prisma/client'
import { formatDate, isBefore } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

type Props = {
  bookings: Booking[]
  onPick: (date: Date) => void
  pickedDate: string
}

export default function BookingDatePicker({
  bookings,
  onPick,
  pickedDate,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)

  function handlePick(d: Date) {
    setIsOpen(false)
    onPick(d)
  }

  return (
    <div>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={'secondary'}
            onClick={() => setIsOpen(true)}
          >
            <CalendarIcon className='w-4 h-4 mr-2' /> See Available Dates
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className='md:max-w-[90vw]'>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pickedDate ? (
                <span className='text-rose-600'>
                  You picked: {formatDate(pickedDate, 'MMMM d, yyyy')}
                </span>
              ) : (
                'Pick a Date'
              )}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <Calendar
            classNames={{
              caption_start: 'w-full',
              table: 'w-full [&_tr]:grid [&_tr]:grid-cols-7',
              head: 'pb-12',
            }}
            components={{
              Day: ({ date }) => {
                const scheduledBookings = bookings.filter(
                  (booking) =>
                    new Date(booking.pickupDate).getDate() === date.getDate() &&
                    new Date(booking.pickupDate).getMonth() ===
                      date.getMonth() &&
                    new Date(booking.pickupDate).getFullYear() ===
                      date.getFullYear()
                )
                const isDateInThePast = isBefore(date, new Date())

                return (
                  <div
                    className={cn('text-left ml-2 border rounded p-2', {
                      'cursor-not-allowed bg-rose-500':
                        scheduledBookings.length > 0,
                      'cursor-pointer hover:shadow hover:bg-rose-500 group':
                        scheduledBookings.length === 0,
                      'border-rose-600': pickedDate === date.toString(),
                      'opacity-20 pointer-events-none': isDateInThePast,
                    })}
                    onClick={
                      scheduledBookings.length === 0
                        ? () => handlePick(date)
                        : undefined
                    }
                  >
                    {/* booking header */}
                    <div className='flex items-center justify-between'>
                      <div className='bg-slate-100 dark:bg-slate-800 rounded inline-block p-2 min-w-8 text-center'>
                        {date.getDate()}
                      </div>
                      {scheduledBookings.length > 0 ? (
                        <div className='text-white'>
                          Booked
                          {/* {scheduledBookings.length}{' '}
                          {plural('Booking', scheduledBookings.length)} */}
                        </div>
                      ) : (
                        <div className='text-muted-foreground group-hover:text-white'>
                          {isDateInThePast ? 'Not Available' : 'Available'}
                        </div>
                      )}
                    </div>
                  </div>
                )
              },
            }}
          />

          <div className='flex justify-end'>
            <Button
              variant={'ghost'}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
