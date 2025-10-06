export const salesReportBookingColumns = [
  {
    accessorKey: 'from',
    header: 'Renter',
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
    cell: ({ row }: any) => `₱${row.original.amount?.toLocaleString()}`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Booked At',
    cell: ({ row }: any) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
]
