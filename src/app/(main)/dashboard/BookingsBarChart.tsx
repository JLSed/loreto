'use client'

import { Booking } from '@prisma/client'
import { format } from 'date-fns'
import { Chart } from 'react-google-charts'

export default function BookingsBarChart(props: { data: Booking[] }) {
  const bookingsGroupedByCreatedAt = props.data.reduce((acc, booking) => {
    const key = booking.createdAt.toISOString().split('T')[0]
    if (!acc[key]) {
      acc[key] = 0
    }
    acc[key]++
    return acc
  }, {} as Record<string, number>)

  return (
    <Chart
      chartType='Bar'
      width='100%'
      height='400px'
      data={[
        ['Date', 'Bookings'],
        ...Object.entries(bookingsGroupedByCreatedAt).map(([date, count]) => [
          format(date, 'MMM dd yyyy'),
          count,
        ]),
      ]}
      options={{
        title: 'Bookings',
        colors: ['black'],
        legend: { position: 'none' },
      }}
    />
  )
}
