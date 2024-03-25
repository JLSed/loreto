'use client'

import { VehicleStatusLabel } from '@/common/constants/business'
import { VehicleStatus } from '@/common/enums/enums.db'
import { formatDate } from '@/lib/utils'
import { Vehicle } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'

export const vehiclesTableColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: 'photoUrl',
    header: 'Image',
    cell: ({ row }) => {
      return (
        <Image
          priority
          alt={row.original.name}
          src={row.original.photoUrl}
          width={50}
          height={50}
          className='h-auto w-auto rounded-md'
        />
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'model',
    header: 'Model',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => VehicleStatusLabel[row.original.status as VehicleStatus],
  },
  {
    accessorKey: 'lastMaintenance',
    header: 'Last Maintenance',
    cell: ({ row }) => {
      const date = row.original.lastMaintenance
      return date ? formatDate(date.toString()) : ''
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const vehicle = row.original
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
            <Link href={`/dashboard/vehicles/${vehicle.id}`}>
              <DropdownMenuItem>View details</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/vehicles/${vehicle.id}?action=edit`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
