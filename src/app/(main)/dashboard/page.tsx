import { prisma } from '@/common/configs/prisma'
import { UserRole, UserStatus } from '@/common/enums/enums.db'
import MaterialIcon, { MaterialIconName } from '@/components/ui/material-icon'
import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'
import BookingsBarChart from './BookingsBarChart'
import BookingsDonutChart from './BookingsDonutChart'
import { cn } from '@/lib/utils'
import EarningsDashboard from './earnings-dashboard'

export default async function Page() {
  const [boxOrders, bookings, transactions, activeCustomers, auditLogs] =
    await Promise.all([
      prisma.boxOrder.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.booking.findMany(),
      prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findMany({
        where: { role: UserRole.Customer, status: UserStatus.Active },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              username: true,
              photoUrl: true,
            },
          },
        },
      }),
    ])

  return (
    <div className='animate-in fade-in duration-500'>
      <header className='p-4 sm:p-6 lg:p-8 pb-0 animate-in slide-in-from-top duration-300'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-primary/10'>
            <MaterialIcon
              name='dashboard'
              className='text-primary'
            />
          </div>
          <div>
            <h2 className='border-b-0 mb-1 text-xl sm:text-2xl'>Dashboard</h2>
            <p className='text-sm text-muted-foreground'>
              Welcome back! Here&apos;s your business overview
            </p>
          </div>
        </div>
      </header>

      {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 px-4 sm:px-6 lg:px-8'>
        <CardOverviewItem
          label={'Orders'}
          value={boxOrders.length}
          materialIconName={'package_2'}
          className='bg-primary/10 border-primary/20 hover:bg-primary/20'
          index={0}
        />
        <CardOverviewItem
          label={'Bookings'}
          value={bookings.length}
          materialIconName={'local_shipping'}
          className='bg-primary/10 border-primary/20 hover:bg-primary/20'
          index={1}
        />
        <CardOverviewItem
          label={'Transactions'}
          value={transactions.length}
          materialIconName={'receipt_long'}
          className='bg-primary/10 border-primary/20 hover:bg-primary/20'
          index={2}
        />
        <CardOverviewItem
          label={'Active Customers'}
          value={activeCustomers.length}
          materialIconName={'group'}
          className='bg-primary/10 border-primary/20 hover:bg-primary/20'
          index={3}
        />
      </div>

      <div className='animate-in fade-in duration-500 delay-400'>
        <EarningsDashboard />
      </div>

      {/* Charts Section - Stack on mobile, side by side on desktop */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 animate-in slide-in-from-bottom duration-500 delay-600'>
        <Card className='p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300'>
          <div className='flex items-center gap-2 mb-4 sm:mb-6'>
            <h3 className='font-semibold text-foreground text-sm sm:text-base'>
              Recent Bookings
            </h3>
          </div>
          <div className=''>
            <BookingsBarChart data={bookings} />
          </div>
        </Card>
        <Card className='p-4 sm:p-6 hover:shadow-lg transition-shadow duration-300'>
          <div className='flex items-center gap-2 mb-4 sm:mb-6'>
            <h3 className='font-semibold text-foreground text-sm sm:text-base'>
              Booking Status
            </h3>
          </div>
          <div className=''>
            <BookingsDonutChart data={bookings} />
          </div>
        </Card>
      </div>
    </div>
  )
}

const CardOverviewItem = (props: {
  label: ReactNode
  value: ReactNode
  materialIconName: MaterialIconName
  className?: string
  index?: number
}) => {
  return (
    <Card
      className={cn(
        'p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-md border-2',
        props.className
      )}
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='text-xs sm:text-sm font-medium text-muted-foreground capitalize'>
          {props.label}
        </div>
        <div className='p-1.5 sm:p-2 rounded-lg bg-card/80 shadow-sm'>
          <MaterialIcon
            name={props.materialIconName}
            className='text-muted-foreground w-4 h-4 sm:w-5 sm:h-5'
          />
        </div>
      </div>
      <div className='text-xl sm:text-2xl font-bold text-foreground'>
        {props.value}
      </div>
      <div className='mt-2 text-xs text-muted-foreground'>Total count</div>
    </Card>
  )
}
