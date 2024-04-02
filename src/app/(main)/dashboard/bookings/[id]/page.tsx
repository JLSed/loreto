import { getBookingById } from './actions'
import BookingDetails from './BookingDetails'

export default async function Page(props: {
  params: {
    id: string
  }
}) {
  const data = await getBookingById(props.params.id)

  return (
    <div>
      <header className='p-4'>
        <h3>Edit Booking</h3>
      </header>

      <BookingDetails data={data} />
    </div>
  )
}
