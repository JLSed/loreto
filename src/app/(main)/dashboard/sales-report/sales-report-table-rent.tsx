'use client'

import { DataTable } from '@/components/shared/DataTable'
import { salesReportRentColumns } from './sales-report-rent-columns'

export default function SalesReportTableRent({ data }: { data: any[] }) {
  return (
    <DataTable
      columns={salesReportRentColumns}
      data={data}
    />
  )
}
