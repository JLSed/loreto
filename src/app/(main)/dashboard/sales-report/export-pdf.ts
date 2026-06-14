import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'

interface SalesSummary {
  total: number
  rent: number
  box: number
  booking: number
}

interface DateRange {
  from: Date
  to: Date
}

export function exportSalesReportPDF({
  dateRange,
  description,
  summary,
  exportDate,
}: {
  dateRange: DateRange
  description: string
  summary: SalesSummary
  exportDate: string
}) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width

  // Format date range for display
  const fromFormatted = format(dateRange.from, 'MMM dd, yyyy hh:mm a')
  const toFormatted = format(dateRange.to, 'MMM dd, yyyy hh:mm a')

  // Header - Company Name (Centered)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  const companyName = 'LORETO BOXES TRADING'
  // Calculate width manually for text centering
  const companyNameWidth = companyName.length * 4 // Rough estimation
  doc.text(companyName, (pageWidth - companyNameWidth) / 2, 25)

  // Header - Sales Report (Centered)
  doc.setFontSize(16)
  const reportTitle = 'SALES REPORT'
  // Calculate width manually for text centering
  const reportTitleWidth = reportTitle.length * 4 // Rough estimation
  doc.text(reportTitle, (pageWidth - reportTitleWidth) / 2, 35)

  // Horizontal line
  doc.setLineWidth(0.5)
  doc.line(20, 45, pageWidth - 20, 45)

  // Description and Terms section
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')

  let yPosition = 55

  // Description
  if (description) {
    doc.text('Description:', 25, yPosition)
    const descriptionLines = doc.splitTextToSize(description, pageWidth - 100)
    doc.text(descriptionLines, 25, yPosition + 8)
    yPosition += descriptionLines.length * 5 + 8
  } else {
    doc.text('Description:', 25, yPosition)
    yPosition += 10
  }

  // Date range and export date on the right side
  doc.setFontSize(10)
  doc.text('Report Period:', pageWidth - 90, 55)
  doc.text(`From: ${fromFormatted}`, pageWidth - 90, 63)
  doc.text(`To: ${toFormatted}`, pageWidth - 90, 71)
  doc.text(`Exported: ${exportDate}`, pageWidth - 90, 81)
  doc.setFontSize(11)

  // Bottom line for description section
  yPosition = Math.max(yPosition, 90)
  doc.line(20, yPosition, pageWidth - 20, yPosition)

  // Categories and Earnings Table
  yPosition += 15

  // Table headers
  doc.setFont('helvetica', 'bold')
  doc.text('Category', 25, yPosition)
  doc.text('Earnings', pageWidth - 50, yPosition)

  yPosition += 5
  doc.line(20, yPosition, pageWidth - 20, yPosition)

  // Table content
  doc.setFont('helvetica', 'normal')
  yPosition += 10

  // Rental
  doc.text('Rental', 25, yPosition)
  doc.text(
    `${summary.rent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    pageWidth - 50,
    yPosition
  )
  yPosition += 8
  doc.line(20, yPosition, pageWidth - 20, yPosition)

  // Shipping Box
  yPosition += 10
  doc.text('Shipping Box', 25, yPosition)
  doc.text(
    `${summary.box.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    pageWidth - 50,
    yPosition
  )
  yPosition += 8
  doc.line(20, yPosition, pageWidth - 20, yPosition)

  // Vehicle Rental
  yPosition += 10
  doc.text('Vehicle Rental', 25, yPosition)
  doc.text(
    `${summary.booking.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    pageWidth - 50,
    yPosition
  )
  yPosition += 8
  doc.line(20, yPosition, pageWidth - 20, yPosition)

  // Total
  yPosition += 15
  doc.setFont('helvetica', 'bold')
  doc.text('Total', pageWidth - 80, yPosition)
  doc.text(
    `${summary.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    pageWidth - 50,
    yPosition
  )

  // Save the PDF with date range in filename
  const fromFile = format(dateRange.from, 'yyyy-MM-dd')
  const toFile = format(dateRange.to, 'yyyy-MM-dd')
  const fileName = `sales-report_${fromFile}_to_${toFile}.pdf`
  doc.save(fileName)
}
