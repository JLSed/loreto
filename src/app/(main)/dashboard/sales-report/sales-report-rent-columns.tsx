import { ColumnDef } from '@tanstack/react-table'
import { TGetTenants } from '../tenants/tenants-action'
import { pesos } from '@/lib/utils'

export const salesReportRentColumns: ColumnDef<TGetTenants>[] = [
  {
    accessorKey: 'from',
    header: 'Tenant',
    cell: ({ row }: any) => {
      const from = row.original.from
      return from ? `${from.firstName} ${from.lastName}` : '-'
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }: any) => row.original.from?.email || '-',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: any) => `₱${row.original.amount?.toLocaleString()}`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Paid At',
    cell: ({ row }: any) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
]
