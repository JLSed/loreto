'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { getBookings } from './actions'
import BookingStatusLabel from '@/components/shared/BookingStatusLabel'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export type Booking = Awaited<ReturnType<typeof getBookings>>[number]

export const bookingsColumns: ColumnDef<Booking>[] = [
  {
    accessorKey: 'pickupDate',
    header: 'Pickup Date',
    cell: ({ row }) => {
      const b = row.original
      return format(b.pickupDate, 'MMMM dd yyyy')
    },
  },
  {
    accessorKey: 'destination',
    header: 'Destination',
  },
  {
    accessorKey: 'pickUpLocation',
    header: 'Pick Up Location',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const b = row.original
      return <BookingStatusLabel status={b.status} />
    },
  },
  {
    id: 'Customer',
    header: 'Booked by',
    cell: ({ row }) => {
      const b = row.original
      return (
        <div className='flex items-center -translate-x-2'>
          <Avatar className='scale-50'>
            <AvatarImage src={b.booker.photoUrl ?? ''} />
            <AvatarFallback>{b.booker.username[0]}</AvatarFallback>
          </Avatar>
          <div>{b.booker.username}</div>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-8 w-8 p-0'
            >
              <span className='sr-only'>Open menu</span>
              <DotsHorizontalIcon className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/dashboard/bookings/${row.original.id}`}>
              <DropdownMenuItem>Update status</DropdownMenuItem>
            </Link>
            <DropdownMenuItem disabled>View details</DropdownMenuItem>
            <DropdownMenuItem disabled>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
