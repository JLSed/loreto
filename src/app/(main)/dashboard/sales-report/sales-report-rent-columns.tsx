import { ColumnDef } from '@tanstack/react-table'
import { TGetTenants } from '../tenants/tenants-action'
import { pesos } from '@/lib/utils'

export const salesReportRentColumns: ColumnDef<TGetTenants>[] = [
  {
    accessorKey: 'firstName',
    header: 'Tenant',
    cell: ({ row }: any) =>
      `${row.original.firstName} ${row.original.lastName}`,
  },
  {
    accessorKey: 'emailAddress',
    header: 'Email',
  },
  {
    accessorKey: 'monthlyPayment',
    header: 'Monthly Payment',
    cell: ({ row }: any) => pesos(row.original.monthlyPayment),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }: any) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
]
