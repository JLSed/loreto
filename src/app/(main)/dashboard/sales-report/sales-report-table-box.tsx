'use client'

import { DataTable } from '@/components/shared/DataTable'
import { salesReportBoxColumns } from './sales-report-box-columns'

export default function SalesReportTableBox({ data }: { data: any[] }) {
  return (
    <DataTable
      columns={salesReportBoxColumns}
      data={data}
    />
  )
}
