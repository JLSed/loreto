import { BookingStatus } from '@/common/enums/enums.db'
import StatusWithDot from './StatusWithDot'

export default function BookingStatusLabel(props: { status: BookingStatus }) {
  switch (props.status) {
    case BookingStatus.Cancelled:
      return <StatusWithDot label={'Cancelled'} />
    case BookingStatus.Pending:
      return (
        <StatusWithDot
          label={'Pending'}
          color='orange'
        />
      )
    case BookingStatus.Completed:
      return (
        <StatusWithDot
          label={'Completed'}
          color='yellowgreen'
        />
      )
    case BookingStatus.Confirmed:
      return (
        <StatusWithDot
          label={'Confirmed'}
          color='dodgerblue'
        />
      )
    case BookingStatus.OnTheRoad:
      return (
        <StatusWithDot
          label={'On The Road'}
          color='red'
        />
      )
    default:
      break
  }
}
