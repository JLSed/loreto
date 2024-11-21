import { getBookings } from '../actions'
import BookingCalendar from './BookingCalendar'

export default async function Page() {
  const bookings = await getBookings()
  return (
    <div>
      <header className='p-4 flex items-center justify-between'>
        <h2>Booking Calendar</h2>
      </header>

      <BookingCalendar bookings={bookings} />
    </div>
  )
}
