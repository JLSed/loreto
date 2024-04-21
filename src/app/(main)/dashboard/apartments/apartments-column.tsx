'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Apartment } from './page'
import { Badge } from '@/components/ui/badge'
import { CheckIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { pesos } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import DeleteVehicle from './DeleteApartment'

export const apartmentsColumn: ColumnDef<Apartment>[] = [
  {
    accessorKey: 'address',
    header: 'Complete Address',
    cell: ({ row }) => <div>{row.original.address}</div>,
  },
  {
    accessorKey: 'area',
    header: 'Floor Area',
    cell: ({ row }) => (
      <div>
        {row.original.area} m<sup>2</sup>
      </div>
    ),
  },
  {
    id: 'utilities',
    header: 'Interior',
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-2'>
          <Badge variant={'secondary'}>
            {row.original.bedrooms}{' '}
            {row.original.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}
          </Badge>
          <Badge variant={'secondary'}>
            {row.original.toiletAndBath} Toilet and Bath
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: 'maxOccupantsPerUnit',
    header: 'Can be occupied by',
    cell: ({ row }) => (
      <div>
        {row.original.maxOccupantsPerUnit}{' '}
        {row.original.maxOccupantsPerUnit > 1 ? 'persons' : 'person'}
      </div>
    ),
  },
  {
    id: 'parking',
    header: 'Parking Spaces',
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-2'>
          {row.original.withCarParkingSpace && (
            <Badge variant={'secondary'}>
              <CheckIcon className='mr-1' /> Car
            </Badge>
          )}
          {row.original.withMotorcycleParkingSpace && (
            <Badge variant={'secondary'}>
              <CheckIcon className='mr-1' /> Motorcycle
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'monthlyRentalPrice',
    header: 'Monthly Rental Price',
    cell: ({ row }) => pesos(row.original.monthlyRentalPrice),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'ghost'}
              size={'icon'}
            >
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/dashboard/apartments/${row.original.id}`}>
              <DropdownMenuItem>View details</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/apartments/${row.original.id}?edit=true`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <DeleteVehicle id={row.original.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
