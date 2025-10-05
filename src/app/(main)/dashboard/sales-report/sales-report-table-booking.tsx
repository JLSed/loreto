'use client'

import { DataTable } from '@/components/shared/DataTable'
import { salesReportBookingColumns } from './sales-report-booking-columns'

export default function SalesReportTableBooking({ data }: { data: any[] }) {
  return (
    <DataTable
      columns={salesReportBookingColumns}
      data={data}
    />
  )
}
