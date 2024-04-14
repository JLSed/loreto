import PageUnderConstruction from '@/components/shared/PageUnderConstruction'

import { prisma } from '@/common/configs/prisma'
import {
  AuditAction,
  AuditAffectedTable,
  UserRole,
  UserStatus,
} from '@/common/enums/enums.db'
import MaterialIcon, { MaterialIconName } from '@/components/ui/material-icon'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReactNode } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ArrowRightIcon } from '@radix-ui/react-icons'

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

          <div className='grid grid-cols-12 gap-4'>
            <Card className='mt-4 col-span-8'>
              <CardHeader className='small'>Most Recent Logs</CardHeader>
              <CardContent>
                <ScrollArea className='max-h-[320px] overflow-y-visible'>
                  <ul>
                    {auditLogs.map((log) => {
                      const action =
                        log.action === AuditAction.Creation
                          ? 'created'
                          : 'modified'

                      return (
                        <li
                          key={log.id}
                          className='py-1'
                        >
                          <div className='flex items-center'>
                            <Avatar className='scale-50'>
                              <AvatarImage
                                src={log.actor.photoUrl ?? ''}
                                alt=''
                              />
                              <AvatarFallback>
                                {log.actor.username[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className='capitalize mr-4 text-sm max-w-[200px] truncate text-ellipsis'>
                              {log.actor.username}
                            </div>
                            <span className='text-sm'>{action}</span>
                            <span className='text-muted-foreground mx-4'>
                              {AuditAffectedTable[log.affectedTable]}
                            </span>
                            {log.action === AuditAction.Modification && (
                              <>
                                <Badge
                                  className='capitalize'
                                  variant={'outline'}
                                >
                                  {log.columnName}
                                </Badge>
                                <Badge
                                  className='mx-4'
                                  variant={'secondary'}
                                >
                                  {log.from}
                                </Badge>
                                <ArrowRightIcon />
                                <Badge
                                  className='ml-4'
                                  variant={'secondary'}
                                >
                                  {log.to}
                                </Badge>
                              </>
                            )}
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
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
