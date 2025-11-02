import { BookingsDataTable } from './data-table'
import { bookingsColumns } from './columns'
import { getBookings } from './actions'

export default async function Page() {
  const bookings = await getBookings()

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold'>Vehicle Bookings</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage vehicle reservations and booking status
          </p>
        </div>
        {/* <Link href='/dashboard/bookings/calendar'>
          <Button className='w-full sm:w-auto'>View Calendar</Button>
        </Link> */}
      </header>

      <div className='overflow-hidden'>
        <BookingsDataTable
          columns={bookingsColumns}
          data={bookings}
        />
      </div>
    </div>
  )
}
