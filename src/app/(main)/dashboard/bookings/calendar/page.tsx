import { getBookings } from '../actions'
import BookingCalendar from './BookingCalendar'

interface PageProps {
  searchParams: Promise<{
    vehicleId: string
    bookingId?: string
  }>
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams
  const bookings = await getBookings(searchParams.vehicleId)

  return (
    <div>
      <header className='p-4 flex items-center justify-between'>
        <h2>
          Bookings{' '}
          {searchParams.vehicleId && `for ${bookings[0].vehicle.name}`}
        </h2>
      </header>

      <BookingCalendar
        bookings={bookings}
        bookingId={searchParams.bookingId}
      />
    </div>
  )
}
