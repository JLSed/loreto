'use client'

import { DataTable } from '@/components/shared/DataTable'
import { Inquiry } from './page'
import { format } from 'date-fns'

import InquiryUpdateStatus from './inquiry-update-status'

type Props = {
  inquiries: Inquiry[]
}

export default function InquiryTable({ inquiries }: Props) {
  return (
    <DataTable
      columns={[
        {
          id: 'inquirer',
          header: 'From',
          cell: ({ row }) => {
            const i = row.original
            return `${i.firstName} ${i.lastName}`
          },
        },
        {
          accessorKey: 'email',
          header: 'Email',
        },
        {
          accessorKey: 'contactNumber',
          header: 'Contact Number',
        },

        {
          accessorKey: 'preferredVisitationDate',
          header: 'Preferred Visitation Date',
          cell: ({ row }) => {
            return format(row.original.preferredVisitationDate, 'MMM d, Y')
          },
        },
        {
          accessorKey: 'remarks',
          header: 'Remarks/Notes',
        },
        {
          accessorKey: 'status',
          header: 'Status',
          cell: ({ row }) => {
            return <InquiryUpdateStatus inquiry={row.original} />
          },
        },
      ]}
      data={inquiries}
    />
  )
}
