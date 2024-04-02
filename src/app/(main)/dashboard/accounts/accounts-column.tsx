'use client'

import { ColumnDef } from '@tanstack/react-table'
import { getAccountsForDashboard } from './accounts-actions'
import { formatDistance } from 'date-fns'
import UserRoleLabel from '@/components/shared/UserRoleLabel'
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

type Account = Awaited<ReturnType<typeof getAccountsForDashboard>>[number]

export const accountsColumns: ColumnDef<Account>[] = [
  {
    accessorKey: 'photoUrl',
    header: 'Username',
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <Avatar className='scale-50'>
            <AvatarImage src={row.original.photoUrl ?? ''} />
            <AvatarFallback>{row.original.firstName[0]}</AvatarFallback>
          </Avatar>
          <div>{row.original.username}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <UserRoleLabel role={row.original.role} />,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'joinedAt',
    header: 'Joined',
    cell: ({ row }) =>
      formatDistance(new Date(row.original.joinedAt), new Date(), {
        addSuffix: true,
      }),
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
            <Link
              href={`/dashboard/accounts/switch-role?userId=${row.original.id}`}
            >
              <DropdownMenuItem>Edit user role</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
