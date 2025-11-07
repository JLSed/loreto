import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface SalesSummary {
  total: number
  rent: number
  box: number
  booking: number
}

export function exportSalesReportPDF({
  month,
  description,
  summary,
  exportDate,
}: {
  month: string
  description: string
  summary: SalesSummary
  exportDate: string
}) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width

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

  // Terms and Date on the right side
  doc.text(`Terms: ${month}`, pageWidth - 80, 55)
  doc.text(`Date: ${exportDate}`, pageWidth - 80, 65)

  // Bottom line for description section
  yPosition = Math.max(yPosition, 75)
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

  // Save the PDF
  const fileName = `${month.replace(' ', '-')}-sales-report.pdf`
  doc.save(fileName)
}
