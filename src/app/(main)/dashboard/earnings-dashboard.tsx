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
    <div className='container mx-auto p-4 sm:p-6 lg:p-8'>
      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
        <CardOverviewItem
          label={'Total Earnings'}
          value={pesos(total)}
          materialIconName={'payments'}
          className='bg-accent/10 border-accent/20'
        />
        <CardOverviewItem
          label={'Rent Earnings'}
          value={pesos(rent._sum.amount || 0)}
          materialIconName={'apartment'}
          className='bg-accent/10 border-accent/20'
        />
        <CardOverviewItem
          label={'Box Earnings'}
          value={pesos(box._sum.amount || 0)}
          materialIconName={'inventory_2'}
          className='bg-secondary/10 border-secondary/20'
        />
        <CardOverviewItem
          label={'Booking Earnings'}
          value={pesos(booking._sum.amount || 0)}
          materialIconName={'local_shipping'}
          className='bg-accent/10 border-accent/20'
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
    <Card
      className={cn(
        'p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:scale-105 hover:shadow-md border-2',
        props.className
      )}
    >
      <div className='flex items-center justify-between mb-2 sm:mb-3'>
        <div className='text-xs sm:text-sm capitalize text-muted-foreground font-medium'>
          {props.label}
        </div>
        <div className='p-1.5 sm:p-2 rounded-lg bg-card/80 shadow-sm'>
          <MaterialIcon
            name={props.materialIconName}
            className='text-muted-foreground w-4 h-4 sm:w-5 sm:h-5'
          />
        </div>
      </div>
      <h3 className='text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate'>
        {props.value}
      </h3>
      <div className='mt-1 sm:mt-2 text-xs text-muted-foreground'>
        Current total
      </div>
    </Card>
  )
}
