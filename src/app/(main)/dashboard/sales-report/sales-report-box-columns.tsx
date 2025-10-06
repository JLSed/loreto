import { computePrice, pesos } from '@/lib/utils'

export const salesReportBoxColumns = [
  {
    accessorKey: 'from',
    header: 'Customer',
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
    header: 'Total Price',
    cell: ({ row }: any) => `${pesos(row.original.amount)}`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Ordered At',
    cell: ({ row }: any) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
]
