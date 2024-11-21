'use client'

import BookingStatusLabel from '@/components/shared/BookingStatusLabel'
import { Calendar } from '@/components/ui/calendar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Booking } from '@prisma/client'
import Link from 'next/link'

type Props = {
  bookings: Booking[]
}

export default function BookingCalendar({ bookings }: Props) {
  return (
    <div>
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
                new Date(booking.pickupDate).getMonth() === date.getMonth() &&
                new Date(booking.pickupDate).getFullYear() ===
                  date.getFullYear()
            )
            return (
              <div className='text-left ml-2 border rounded p-2'>
                {/* booking header */}
                <div className='flex items-center justify-between'>
                  <div className='bg-slate-100 rounded inline-block p-2 min-w-8 text-center'>
                    {date.getDate()}
                  </div>
                  {scheduledBookings.length > 0 && (
                    <div>{scheduledBookings.length} bookings</div>
                  )}
                </div>

                <div className='space-y-2 pt-2'>
                  {scheduledBookings.map((b) => {
                    return (
                      <TooltipProvider key={b.id}>
                        <Tooltip delayDuration={200}>
                          <TooltipTrigger asChild>
                            <Link
                              href={`/dashboard/bookings/${b.id}`}
                              className='line-clamp-1 text-ellipsis hover:underline'
                            >
                              • {b.destination}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <div>Pick up: {b.pickUpLocation}</div>
                              <div>Destination: {b.destination}</div>
                              <div>
                                <BookingStatusLabel status={b.status} />
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              </div>
            )
          },
        }}
      />
    </div>
  )
}
