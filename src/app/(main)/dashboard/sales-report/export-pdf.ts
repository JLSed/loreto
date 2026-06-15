import jsPDF from 'jspdf'
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

/**
 * Loads the company logo from the public directory and converts it to a base64 Data URL.
 */
function getLogoBase64(): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/logo.png'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } else {
        resolve('')
      }
    }
    img.onerror = () => {
      resolve('')
    }
  })
}

export async function exportSalesReportPDF({
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

  const logoBase64 = await getLogoBase64()

  let y = 20
  if (logoBase64) {
    const logoSize = 18
    const logoX = (pageWidth - logoSize) / 2
    doc.addImage(logoBase64, 'PNG', logoX, y, logoSize, logoSize)
    y += logoSize + 10
  }

  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(17, 24, 39) // slate-900
  const brandName = 'Loreto Trading'
  doc.text(brandName, (pageWidth - doc.getTextWidth(brandName)) / 2, y)
  y += 7

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(156, 163, 175) // gray-400
  const brandSubtitle = 'SALES REPORT'
  doc.text(brandSubtitle, (pageWidth - doc.getTextWidth(brandSubtitle)) / 2, y)
  y += 18

  const leftX = 20
  const rightX = pageWidth - 20

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(17, 24, 39) // slate-900
  doc.text('Revenue Summary', leftX, y)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(107, 114, 128) // gray-500
  const dateGenLabel = 'Date Generated'
  doc.text(dateGenLabel, rightX - doc.getTextWidth(dateGenLabel), y)

  y += 6

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(55, 65, 81) // gray-700
  const fromFormatted = format(dateRange.from, 'MMMM d, yyyy')
  const toFormatted = format(dateRange.to, 'MMMM d, yyyy')
  const periodText =
    fromFormatted === toFormatted
      ? fromFormatted
      : `${fromFormatted} - ${toFormatted}`
  doc.text(periodText, leftX, y)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(107, 114, 128) // gray-500
  doc.text(exportDate, rightX - doc.getTextWidth(exportDate), y)

  y += 12

  const cardW = 80
  const cardH = 26
  const cardGapX = 10
  const cardGapY = 6

  const col1X = leftX
  const col2X = leftX + cardW + cardGapX

  const formatAmount = (num: number) => {
    return (
      'P ' +
      num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    )
  }

  const drawCard = (
    x: number,
    y: number,
    label: string,
    amount: number,
    isGreen: boolean = false,
  ) => {
    // Card border
    doc.setDrawColor(229, 231, 235) // gray-200
    doc.setFillColor(255, 255, 255)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, cardW, cardH, 3, 3, 'FD')

    // Card label
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    if (isGreen) {
      doc.setTextColor(22, 163, 74) // green-600
    } else {
      doc.setTextColor(156, 163, 175) // gray-400
    }
    doc.text(label, x + 6, y + 8)

    // Card Value
    doc.setFontSize(15)
    doc.setFont('helvetica', 'bold')
    if (isGreen) {
      doc.setTextColor(22, 163, 74) // green-600
    } else {
      doc.setTextColor(17, 24, 39) // slate-900
    }
    doc.text(formatAmount(amount), x + 6, y + 18)
  }

  // Row 1
  const row1Y = y
  drawCard(col1X, row1Y, 'TOTAL REVENUE', summary.total, true)
  drawCard(col2X, row1Y, 'RENT EARNINGS', summary.rent)

  // Row 2
  const row2Y = y + cardH + cardGapY
  drawCard(col1X, row2Y, 'BOX EARNINGS', summary.box)
  drawCard(col2X, row2Y, 'BOOKING EARNINGS', summary.booking)

  y = row2Y + cardH + 12

  // 4. Description section
  if (description) {
    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(17, 24, 39)
    doc.text('Description', leftX, y)
    y += 5

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(75, 85, 99)
    const descLines = doc.splitTextToSize(description, pageWidth - 40)
    doc.text(descLines, leftX, y)
  }

  // Save the PDF
  const fromFile = format(dateRange.from, 'yyyy-MM-dd')
  const toFile = format(dateRange.to, 'yyyy-MM-dd')
  const fileName = `sales-report_${fromFile}_to_${toFile}.pdf`
  doc.save(fileName)
}
