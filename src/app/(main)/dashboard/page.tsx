import PageUnderConstruction from '@/components/shared/PageUnderConstruction'

import { prisma } from '@/common/configs/prisma'
import { UserRole, UserStatus } from '@/common/enums/enums.db'
import MaterialIcon, { MaterialIconName } from '@/components/ui/material-icon'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReactNode } from 'react'

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
      <header className='p-4 pb-0'>
        <h2 className='border-b-0'>Dashboard</h2>
      </header>

      <Tabs
        defaultValue='overview'
        className='p-4'
      >
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='analytics'>Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value='overview'>
          <div className='grid grid-cols-12 gap-4 pt-2'>
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
        </TabsContent>

        <TabsContent value='analytics'>
          <div className='pt-2'>
            <PageUnderConstruction />
          </div>
        </TabsContent>
      </Tabs>
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
