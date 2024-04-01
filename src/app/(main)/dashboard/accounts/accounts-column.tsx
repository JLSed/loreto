'use client'

import { ColumnDef } from '@tanstack/react-table'
import { getAccountsForDashboard } from './accounts-actions'
import { format, formatDistance, formatRelative } from 'date-fns'
import UserRoleLabel from '@/components/shared/UserRoleLabel'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
]
