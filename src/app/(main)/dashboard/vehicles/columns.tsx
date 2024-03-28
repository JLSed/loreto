'use client'

import { VehicleStatusLabel } from '@/common/constants/business'
import { VehicleStatus } from '@/common/enums/enums.db'
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

import { ArrowDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import StatusWithDot from '@/components/shared/StatusWithDot'
import { VehicleStatusColor } from '@/common/constants/status-colors'

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
    cell: ({ row }) => {
      const status = row.original.status as VehicleStatus
      return (
        <StatusWithDot
          label={VehicleStatusLabel[status]}
          color={VehicleStatusColor[status]}
        />
      )
    },
  },
  {
    accessorKey: 'lastMaintenance',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='-translate-x-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Last Maintenance
          <ArrowDownIcon className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.original.lastMaintenance
      return date ? format(date, 'MMMM dd yyyy') : ''
    },
  },
  {
    accessorKey: 'purchaseDate',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          className='-translate-x-4'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date Purchased
          <ArrowDownIcon className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.original.purchaseDate
      return date ? format(date, 'MMMM dd yyyy') : ''
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
