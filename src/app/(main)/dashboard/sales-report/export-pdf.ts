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
  summary,
}: {
  month: string
  summary: SalesSummary
}) {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(24)
  doc.text(`${month} Sales`, 20, 30)
  doc.setFontSize(14)
  doc.text('Loreto Trading', 20, 45)

  // Table
  autoTable(doc, {
    startY: 60,
    head: [['', '']],
    body: [
      ['Total Earnings', `${summary.total.toLocaleString()}`],
      ['Rent Earnings', `${summary.rent.toLocaleString()}`],
      ['Box Earnings', `${summary.box.toLocaleString()}`],
      ['Booking Earnings', `${summary.booking.toLocaleString()}`],
    ],
    styles: {
      font: 'times',
      fontSize: 14,
      halign: 'left',
      valign: 'middle',
      cellPadding: 6,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
    },
    tableLineColor: [0, 0, 0],
    tableLineWidth: 0.5,
    theme: 'grid',
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 122 },
    },
  })

  doc.save(`${month}-sales-report.pdf`)
}
