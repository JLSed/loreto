'use client'

import { DataTable } from '@/components/shared/DataTable'
import { TGetTenants } from './tenants-action'
import { format } from 'date-fns'
import { pesos } from '@/lib/utils'
import TenantStatusUpdater from './TenantStatus'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
          accessorKey: 'contactNumber',
          header: 'Contact Number',
        },
        {
          accessorKey: 'moveInDate',
          header: 'Move-in Date',
          cell: ({ row }) => format(row.original.moveInDate, 'MMMM d, yyyy'),
        },
        {
          accessorKey: 'monthlyPayment',
          header: 'Monthly Payment',
          cell: ({ row }) => pesos(row.original.monthlyPayment),
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
            return (
              <Link href={`/dashboard/tenants/${row.original.id}`}>
                <Button variant={'link'}>Edit</Button>
              </Link>
            )
          },
        },
      ]}
    />
  )
}
