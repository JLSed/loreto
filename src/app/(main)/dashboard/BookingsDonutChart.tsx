'use client'

import { BookingStatus } from '@/common/enums/enums.db'
import { Booking } from '@prisma/client'
import { Chart } from 'react-google-charts'

type Props = {
  data: Booking[]
}

export default function BookingsDonutChart(props: Props) {
  const data = [
    ['Status', 'Bookings'],
    [
      'Cancelled',
      props.data.filter((b) => b.status === BookingStatus.Cancelled).length,
    ],
    [
      'Pending',
      props.data.filter((b) => b.status === BookingStatus.Pending).length,
    ],
    [
      'Confirmed',
      props.data.filter((b) => b.status === BookingStatus.Confirmed).length,
    ],
    [
      'On The Road',
      props.data.filter((b) => b.status === BookingStatus.OnTheRoad).length,
    ],
    [
      'Completed',
      props.data.filter((b) => b.status === BookingStatus.Completed).length,
    ],
  ]

  return (
    <Chart
      chartType='PieChart'
      width='100%'
      height='400px'
      data={data}
      options={{
        pieHole: 0.4,
        is3D: false,
        colors: ['grey', 'orange', 'yellowgreen', 'dodgerblue', 'green'],
      }}
    />
  )
}
