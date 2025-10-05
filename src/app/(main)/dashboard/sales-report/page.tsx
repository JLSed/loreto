import { getSalesReport } from './actions'
import SalesReportTableRent from './sales-report-table-rent'
import SalesReportTableBox from './sales-report-table-box'
import SalesReportTableBooking from './sales-report-table-booking'

export default async function Page() {
  const { rent, box, booking } = await getSalesReport()

  return (
    <div>
      <header className='p-4 border-b flex items-center justify-between'>
        <h2>Sales Report</h2>
      </header>
      <main className='p-4 space-y-8'>
        <section>
          <h3 className='text-lg font-semibold mb-2'>Sales by Rent</h3>
          <SalesReportTableRent data={rent} />
        </section>
        <section>
          <h3 className='text-lg font-semibold mb-2'>Sales by Box</h3>
          <SalesReportTableBox data={box} />
        </section>
        <section>
          <h3 className='text-lg font-semibold mb-2'>Sales by Booking</h3>
          <SalesReportTableBooking data={booking} />
        </section>
      </main>
    </div>
  )
}
