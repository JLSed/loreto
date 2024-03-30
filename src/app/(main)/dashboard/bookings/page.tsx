import { BookingsDataTable } from './data-table'
import { bookingsColumns } from './columns'
import { getBookings } from './actions'

export default async function Page() {
  const bookings = await getBookings()

  return (
    <div>
      <header className='p-4'>
        <h2>Bookings</h2>
      </header>

      <main className='p-4'>
        <BookingsDataTable
          columns={bookingsColumns}
          data={bookings}
        />
      </main>
    </div>
  )
}
