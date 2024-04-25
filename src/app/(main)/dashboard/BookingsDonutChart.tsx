'use client'

import { BookingStatus } from '@/common/enums/enums.db'
import { Booking } from '@prisma/client'
import { useTheme } from 'next-themes'
import { Chart } from 'react-google-charts'

type Props = {
  data: Booking[]
}

export default function BookingsDonutChart(props: Props) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

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
        pieHole: 0.5,
        is3D: false,
        colors: ['grey', 'orange', 'yellowgreen', 'dodgerblue', 'green'],
        chartArea: { width: '90%', height: '100%' },
        backgroundColor: 'transparent',
        legend: {
          textStyle: {
            color: isDark ? 'white' : 'black',
          },
        },
      }}
    />
  )
}
