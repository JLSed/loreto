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
    <div className='animate-in fade-in duration-500'>
      <header className='p-6 border-b border-gray-200 animate-in slide-in-from-top duration-300'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200'>
              <svg
                className='w-6 h-6 text-emerald-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900'>Sales Report</h2>
              <p className='text-gray-600 mt-1'>
                Overview of your sales performance
              </p>
            </div>
          </div>
          <ExportSalesPdfButton
            summary={{
              total,
              rent: rentTotal,
              box: boxTotal,
              booking: bookingTotal,
            }}
          />
        </div>
      </header>
      <div className='p-6 '>
        <div className='flex items-center gap-3 mb-6'>
          <div className='p-2 rounded-lg bg-blue-50'>
            <svg
              className='w-5 h-5 text-blue-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
              />
            </svg>
          </div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Earnings Overview
          </h3>
        </div>
      </div>

      <div className='animate-in slide-in-from-bottom duration-500 delay-400'>
        <EarningsDashboard />
      </div>

      <main className='p-6 space-y-8 '>
        <section className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-purple-50'>
              <svg
                className='w-5 h-5 text-purple-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2v0a2 2 0 012-2h6l2 2h6a2 2 0 012 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Sales by Rent
            </h3>
          </div>
          <SalesReportTable
            data={rent}
            type='rent'
          />
        </section>

        <section className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-orange-50'>
              <svg
                className='w-5 h-5 text-orange-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Sales by Box
            </h3>
          </div>
          <SalesReportTable
            data={box}
            type='box'
          />
        </section>

        <section className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-blue-50'>
              <svg
                className='w-5 h-5 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold text-gray-900'>
              Sales by Booking
            </h3>
          </div>
          <SalesReportTable
            data={booking}
            type='booking'
          />
        </section>
      </main>
    </div>
  )
}
