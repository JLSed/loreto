import { getBookings } from '../actions'
import BookingCalendar from './BookingCalendar'

interface PageProps {
  searchParams: {
    vehicleId: string
    bookingId?: string
  }
}

export default async function Page(props: PageProps) {
  const bookings = await getBookings(props.searchParams.vehicleId)

  return (
    <div>
      <header className='p-4 flex items-center justify-between'>
        <h2>
          Bookings{' '}
          {props.searchParams.vehicleId && `for ${bookings[0].vehicle.name}`}
        </h2>
      </header>

      <BookingCalendar
        bookings={bookings}
        bookingId={props.searchParams.bookingId}
      />
    </div>
  )
}
