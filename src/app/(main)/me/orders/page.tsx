import React from 'react'
import { getUserOrders } from './actions'
import BoxOrderStatusLabel from '@/components/shared/BoxOrderStatusLabel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BoxPlacement, BoxThickness } from '@/common/enums/enums.db'
import { computePrice, pesos } from '@/lib/utils'

export default async function Pages() {
  const orders = await getUserOrders()

  if (orders.length === 0) {
    return (
      <div className='p-4 text-center'>
        <h4>You have no orders</h4>
      </div>
    )
  }

  return (
    <div className='p-4'>
      <h3>Your Box Orders</h3>

      {orders.map((order) => {
        const width = Math.round(
          order.box.totalWidth * (order.box.leftPanelSize / 100)
        )
        const length = Math.round(
          order.box.totalWidth * (order.box.rightPanelSize / 100)
        )
        return (
          <div
            key={order.id}
            className='rounded-xl p-4 border my-4'
          >
            <div className='flex gap-2'>
              <div className='font-bold capitalize'>
                <div>{order.box.name}</div>
              </div>
              <Badge
                variant={'secondary'}
                className='flex items-center gap-2'
              >
                <div>H: {order.box.height}</div>
                <div>x</div>
                <div>W: {width}</div>
                <div>x</div>
                <div>L: {length}</div>
              </Badge>

              <Badge variant={'outline'}>Class {order.box.quality}</Badge>
              <Badge variant={'outline'}>
                {order.box.placement === BoxPlacement.Inner
                  ? 'Inner'
                  : 'Master'}
              </Badge>
              <Badge variant={'outline'}>
                {order.box.thickness === BoxThickness.Double
                  ? 'Double'
                  : 'Single'}
              </Badge>

              <div className='font-bold ml-auto'>
                {order.quantity} {order.quantity > 1 ? 'Pcs.' : 'Pc.'}
              </div>
            </div>

            <div className='mt-4 flex items-center gap-2'>
              <div>Status:</div>
              <Badge>
                <BoxOrderStatusLabel status={order.status} />
              </Badge>
              <Badge variant={'default'}>
                Total Price:{' '}
                {pesos(
                  order.quantity *
                    computePrice({
                      width: width,
                      height: order.box.height,
                      thickness:
                        order.box.thickness === 1 ? 'single' : 'double',
                      length: length,
                    }).totalPrice
                )}
              </Badge>

              <Link
                href={`/me/boxes?boxId=${order.box.id}`}
                className='ml-auto'
              >
                <Button
                  size={'sm'}
                  variant={'secondary'}
                >
                  View Box Details
                </Button>
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
