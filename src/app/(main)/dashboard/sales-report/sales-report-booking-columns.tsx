export const salesReportBookingColumns = [
  {
    accessorKey: 'booker',
    header: 'Renter',
    cell: ({ row }: any) => {
      const booker = row.original.booker
      return booker ? `${booker.firstName} ${booker.lastName}` : '-'
    },
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }: any) => row.original.booker?.email || '-',
  },
  {
    accessorKey: 'pickupDate',
    header: 'Pickup Date',
    cell: ({ row }: any) =>
      new Date(row.original.pickupDate).toLocaleDateString(),
  },
  {
    accessorKey: 'returnDate',
    header: 'Return Date',
    cell: ({ row }: any) =>
      row.original.returnDate
        ? new Date(row.original.returnDate).toLocaleDateString()
        : '-',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: any) =>
      `₱${row.original.transaction?.amount?.toLocaleString() || 0}`,
  },
  {
    accessorKey: 'createdAt',
    header: 'Booked At',
    cell: ({ row }: any) =>
      new Date(row.original.createdAt).toLocaleDateString(),
  },
]
