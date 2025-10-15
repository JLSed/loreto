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
      <header className='p-4 px-8 pb-0 animate-in slide-in-from-top duration-300'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-blue-50'>
            <MaterialIcon
              name='dashboard'
              className='text-blue-600'
            />
          </div>
          <div>
            <h2 className='border-b-0 mb-1'>Dashboard</h2>
            <p className='text-sm text-gray-600'>
              Welcome back! Here&apos;s your business overview
            </p>
          </div>
        </div>
      </header>

      <div className='grid grid-cols-12 gap-6 pt-4 px-8'>
        <CardOverviewItem
          label={'Orders'}
          value={boxOrders.length}
          materialIconName={'package_2'}
          className='bg-rose-50 border-rose-200 hover:bg-rose-100'
          index={0}
        />
        <CardOverviewItem
          label={'Bookings'}
          value={bookings.length}
          materialIconName={'local_shipping'}
          className='bg-green-50 border-green-200 hover:bg-green-100'
          index={1}
        />
        <CardOverviewItem
          label={'Transactions'}
          value={transactions.length}
          materialIconName={'receipt_long'}
          className='bg-purple-50 border-purple-200 hover:bg-purple-100'
          index={2}
        />
        <CardOverviewItem
          label={'Active Customers'}
          value={activeCustomers.length}
          materialIconName={'group'}
          className='bg-blue-50 border-blue-200 hover:bg-blue-100'
          index={3}
        />
      </div>

      <div className='animate-in fade-in duration-500 delay-400'>
        <EarningsDashboard />
      </div>

      <div className='grid grid-cols-2 gap-8 p-8 animate-in slide-in-from-bottom duration-500 delay-600'>
        <Card className='p-6 hover:shadow-lg transition-shadow duration-300'>
          <div className='flex items-center gap-2 mb-6'>
            <div className='p-2 rounded-lg bg-blue-50'>
              <MaterialIcon
                name='dashboard'
                className='text-blue-600'
              />
            </div>
            <h3 className='font-semibold text-gray-900'>Recent Bookings</h3>
          </div>
          <BookingsBarChart data={bookings} />
        </Card>
        <Card className='p-6 hover:shadow-lg transition-shadow duration-300'>
          <div className='flex items-center gap-2 mb-6'>
            <div className='p-2 rounded-lg bg-green-50'>
              <MaterialIcon
                name='dashboard'
                className='text-green-600'
              />
            </div>
            <h3 className='font-semibold text-gray-900'>Booking Status</h3>
          </div>
          <BookingsDonutChart data={bookings} />
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
        'col-span-3 p-6 transition-all duration-300 hover:scale-105 hover:shadow-md border-2',
        props.className
      )}
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='text-sm font-medium text-gray-600 capitalize'>
          {props.label}
        </div>
        <div className='p-2 rounded-lg bg-white/80 shadow-sm'>
          <MaterialIcon
            name={props.materialIconName}
            className='text-gray-700'
          />
        </div>
      </div>
      <div className='text-2xl font-bold text-gray-900'>{props.value}</div>
      <div className='mt-2 text-xs text-gray-500'>Total count</div>
    </Card>
  )
}
