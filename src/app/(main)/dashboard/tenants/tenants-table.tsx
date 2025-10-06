'use client'

import { DataTable } from '@/components/shared/DataTable'
import { deleteTenant, TGetTenants } from './tenants-action'
import { format } from 'date-fns'
import { pesos } from '@/lib/utils'
import TenantStatusUpdater from './TenantStatus'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'

interface Props {
  tenants: TGetTenants
}

export default function TenantsTable(props: Props) {
  return (
    <DataTable
      data={props.tenants}
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },
        {
          accessorKey: 'moveInDate',
          header: 'Move-in Date',
          cell: ({ row }) => format(row.original.moveInDate, 'MMMM d, yyyy'),
        },
        {
          accessorKey: 'contactNumber',
          header: 'Contact',
          cell: ({ row: { original: t } }) => {
            return (
              <div className='space-y-1 text-sm'>
                <div>{t.emailAddress}</div>
                <div>{t.contactNumber}</div>
              </div>
            )
          },
        },
        {
          accessorKey: 'monthlyPayment',
          header: 'Monthly Payment',
          cell: ({ row }) => {
            return (
              <div className='space-y-1 text-sm'>
                <div>{pesos(row.original.monthlyPayment)}</div>
                <div>Due every {row.original.monthlyDueDate}</div>
              </div>
            )
          },
        },
        {
          accessorKey: 'status',
          header: 'Status',
          cell: ({ row }) => {
            return (
              <TenantStatusUpdater
                tenantId={row.original.id}
                status={row.original.status}
              />
            )
          },
        },
        {
          id: 'action',
          header: 'Action',
          cell: ({ row }) => {
            const id = row.original.id
            return (
              <div className='flex items-center gap-3'>
                <Link href={`/dashboard/tenants/${id}`}>
                  <Button variant={'link'}>Edit</Button>
                </Link>
                <Link href={`/dashboard/tenants/rent/${id}`}>
                  <Button variant={'link'}>Rent Details</Button>
                </Link>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  className='hover:text-red-500'
                  onClick={() => {
                    if (
                      confirm('Are you sure you want to delete this tenant?')
                    ) {
                      deleteTenant(id)
                    }
                  }}
                >
                  <Trash2Icon className='w-4 h-4' />
                </Button>
              </div>
            )
          },
        },
      ]}
    />
  )
}
