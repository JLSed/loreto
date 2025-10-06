import EarningsDashboard from '../earnings-dashboard'
import { getSalesReport } from './actions'
import SalesReportTable from './sales-report-table'
import { ExportSalesPdfButton } from './ExportSalesPdfButton'

export default async function Page() {
  const { rent, box, booking } = await getSalesReport()
  // Calculate earnings
  const rentTotal = rent.reduce((sum, t) => sum + (t.amount || 0), 0)
  const boxTotal = box.reduce((sum, t) => sum + (t.amount || 0), 0)
  const bookingTotal = booking.reduce((sum, t) => sum + (t.amount || 0), 0)
  const total = rentTotal + boxTotal + bookingTotal

  const now = new Date()
  const month = now.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      <header className='p-4 border-b flex items-center justify-between'>
        <h2>Sales Report</h2>
        <ExportSalesPdfButton
          month={month}
          summary={{
            total,
            rent: rentTotal,
            box: boxTotal,
            booking: bookingTotal,
          }}
        />
      </header>
      <header className='p-4 px-8 pb-0'>
        <h3 className='border-b-0'>Earnings Overview</h3>
      </header>
      <EarningsDashboard />
      <main className='p-4 space-y-8'>
        <section>
          <h3 className='text-lg font-semibold mb-2'>Sales by Rent</h3>
          <SalesReportTable
            data={rent}
            type='rent'
          />
        </section>
        <section>
          <h3 className='text-lg font-semibold mb-2'>Sales by Box</h3>
          <SalesReportTable
            data={box}
            type='box'
          />
        </section>
        <section>
          <h3 className='text-lg font-semibold mb-2'>Sales by Booking</h3>
          <SalesReportTable
            data={booking}
            type='booking'
          />
        </section>
      </main>
    </div>
  )
}
