import { computePrice, pesos } from '@/lib/utils'

export const salesReportBoxColumns = [
  {
    accessorKey: 'user',
    header: 'Customer',
    cell: ({ row }: any) => {
      const user = row.original.user
      return user ? `${user.firstName} ${user.lastName}` : '-'
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }: any) => row.original.user?.email || '-',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    id: 'totalPrice',
    header: 'Total Price',
    cell: ({ row }: any) => {
      const box = row.original.box
      if (!box) return '-'
      const width = Math.round(box.totalWidth * (box.leftPanelSize / 100))
      const length = Math.round(box.totalWidth * (box.rightPanelSize / 100))
      const computation = computePrice({
        height: box.height,
        width,
        length,
        thickness: box.thickness === 1 ? 'single' : 'double',
      })
      return pesos(computation.totalPrice * row.original.quantity)
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: () => 'Completed',
  },
  {
    accessorKey: 'createdAt',
    header: 'Ordered At',
    cell: ({ row }: any) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
]
