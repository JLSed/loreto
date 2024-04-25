import { prisma } from '@/common/configs/prisma'
import { UserRole, UserStatus } from '@/common/enums/enums.db'
import MaterialIcon, { MaterialIconName } from '@/components/ui/material-icon'
import { Card } from '@/components/ui/card'
import { ReactNode } from 'react'
import BookingsBarChart from './BookingsBarChart'
import BookingsDonutChart from './BookingsDonutChart'

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
    <div>
      <header className='p-4 px-8 pb-0'>
        <h2 className='border-b-0'>Dashboard</h2>
      </header>

      <div className='grid grid-cols-12 gap-8 pt-4 px-8'>
        <CardOverviewItem
          label={'Orders'}
          value={boxOrders.length}
          materialIconName={'package_2'}
        />
        <CardOverviewItem
          label={'Bookings'}
          value={bookings.length}
          materialIconName={'local_shipping'}
        />
        <CardOverviewItem
          label={'Transactions'}
          value={transactions.length}
          materialIconName={'receipt_long'}
        />
        <CardOverviewItem
          label={'Active Customers'}
          value={activeCustomers.length}
          materialIconName={'group'}
        />
      </div>

      <div className='grid grid-cols-2 gap-8 p-8'>
        <div>
          <div className='mb-4 font-medium'>Recent Bookings</div>
          <BookingsBarChart data={bookings} />
        </div>
        <div>
          <div className='font-medium'>Booking Status</div>
          <BookingsDonutChart data={bookings} />
        </div>
      </div>
    </div>
  )
}

const CardOverviewItem = (props: {
  label: ReactNode
  value: ReactNode
  materialIconName: MaterialIconName
}) => {
  return (
    <Card className='col-span-3 p-5'>
      <div className='flex items-center justify-between mb-2'>
        <div className='text-sm capitalize'>{props.label}</div>
        <MaterialIcon name={props.materialIconName} />
      </div>
      <h3>{props.value}</h3>
    </Card>
  )
}
