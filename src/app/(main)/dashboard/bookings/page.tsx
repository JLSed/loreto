import { BookingsDataTable } from './data-table'
import { bookingsColumns } from './columns'
import { getBookings } from './actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Page() {
  const bookings = await getBookings()

  return (
    <div>
      <header className='p-4 flex items-center justify-between'>
        <h2>Bookings</h2>
        <Link href='/dashboard/bookings/calendar'>
          <Button>View on calendar</Button>
        </Link>
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
