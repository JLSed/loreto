import { prisma } from '@/common/configs/prisma'
import { Card } from '@/components/ui/card'
import { cn, pesos } from '@/lib/utils'
import { ReactNode } from 'react'
import MaterialIcon, { MaterialIconName } from '@/components/ui/material-icon'

export default async function EarningsDashboard() {
  // Fetch total earnings for each type from Transaction table
  const [rent, box, booking] = await Promise.all([
    prisma.transaction.aggregate({
      where: { itemType: 3 },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { itemType: 1 },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { itemType: 2 },
      _sum: { amount: true },
    }),
  ])

  const total =
    (rent._sum.amount || 0) +
    (box._sum.amount || 0) +
    (booking._sum.amount || 0)

  return (
    <div>
      <div className='grid grid-cols-12 gap-8 pt-4 px-8'>
        <CardOverviewItem
          label={'Total Earnings'}
          value={pesos(total)}
          materialIconName={'payments'}
          className='bg-yellow-100'
        />
        <CardOverviewItem
          label={'Rent Earnings'}
          value={pesos(rent._sum.amount || 0)}
          materialIconName={'apartment'}
          className='bg-blue-100'
        />
        <CardOverviewItem
          label={'Box Earnings'}
          value={pesos(box._sum.amount || 0)}
          materialIconName={'inventory_2'}
          className='bg-green-100'
        />
        <CardOverviewItem
          label={'Booking Earnings'}
          value={pesos(booking._sum.amount || 0)}
          materialIconName={'local_shipping'}
          className='bg-purple-100'
        />
      </div>
    </div>
  )
}

const CardOverviewItem = (props: {
  label: ReactNode
  value: ReactNode
  materialIconName: MaterialIconName
  className?: string
}) => {
  return (
    <Card className={cn('col-span-3 p-5', props.className)}>
      <div className='flex items-center justify-between mb-2'>
        <div className='text-sm capitalize'>{props.label}</div>
        <MaterialIcon name={props.materialIconName} />
      </div>
      <h3>{props.value}</h3>
    </Card>
  )
}
