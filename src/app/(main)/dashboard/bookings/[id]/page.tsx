import { getBookingById } from './actions'
import BookingDetails from './BookingDetails'

export default async function Page(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params
  const data = await getBookingById(params.id)

  return (
    <div>
      <header className='p-4'>
        <h3>Booking Details</h3>
      </header>

      <BookingDetails data={data} />
    </div>
  )
}
