import EarningsDashboard from '../earnings-dashboard'
import { getSalesReport } from './actions'
import SalesReportTable from './sales-report-table'

export default async function Page() {
  const { rent, box, booking } = await getSalesReport()

  return (
    <div>
      <header className='p-4 border-b flex items-center justify-between'>
        <h2>Sales Report</h2>
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
