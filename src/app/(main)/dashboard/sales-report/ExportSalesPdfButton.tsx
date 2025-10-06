'use client'

import { Button } from '@/components/ui/button'
import { exportSalesReportPDF } from './export-pdf'

interface ExportSalesPdfButtonProps {
  month: string
  summary: {
    total: number
    rent: number
    box: number
    booking: number
  }
}

export function ExportSalesPdfButton({
  month,
  summary,
}: ExportSalesPdfButtonProps) {
  return (
    <Button
      className='mb-4'
      onClick={() => exportSalesReportPDF({ month, summary })}
    >
      Export Sales as PDF
    </Button>
  )
}
