'use client'

import { Booking } from '@prisma/client'
import { format } from 'date-fns'
import { useTheme } from 'next-themes'
import { Chart } from 'react-google-charts'

export default function BookingsBarChart(props: { data: Booking[] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

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
      chartType='ColumnChart'
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
        legend: { position: 'none' },
        backgroundColor: 'transparent',
        chartArea: { width: '90%', height: '80%' },
        hAxis: {
          textStyle: {
            color: isDark ? 'white' : 'black',
          },
        },
        vAxis: {
          gridlines: {
            color: 'transparent',
          },
        },
      }}
    />
  )
}
