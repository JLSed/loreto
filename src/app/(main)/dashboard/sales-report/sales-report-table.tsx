'use client'

import { useState } from 'react'
import { DataTable } from '@/components/shared/DataTable'
import { salesReportRentColumns } from './sales-report-rent-columns'
import { salesReportBoxColumns } from './sales-report-box-columns'
import { salesReportBookingColumns } from './sales-report-booking-columns'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type TableType = 'rent' | 'box' | 'booking'

interface SalesReportTableProps {
  data: any[]
  type: TableType
}

const PAGE_SIZE = 5

export default function SalesReportTable({
  data,
  type,
}: SalesReportTableProps) {
  let columns
  if (type === 'rent') columns = salesReportRentColumns
  else if (type === 'box') columns = salesReportBoxColumns
  else columns = salesReportBookingColumns

  const [page, setPage] = useState(0)
  const pageCount = Math.ceil(data.length / PAGE_SIZE)
  const pagedData = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div>
      <DataTable
        columns={columns}
        data={pagedData}
      />
      <div className='flex justify-center items-center gap-2 mt-2'>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          <ChevronLeft />
        </Button>
        <span>
          Page {page + 1} of {pageCount}
        </span>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page >= pageCount - 1}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
