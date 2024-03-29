import { BookingTravelType } from '@/common/enums/enums.db'

export default function BookingTravelTypeLabel(props: {
  type: BookingTravelType
}) {
  switch (props.type) {
    case BookingTravelType.Hourly:
      return 'Hourly'
    case BookingTravelType.OneWay:
      return 'One Way'
    case BookingTravelType.RoundTrip:
      return 'Round Trip'
    default:
      break
  }
}
