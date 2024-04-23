import React from 'react'
import { getUserOrders } from './actions'
import BoxOrderStatusLabel from '@/components/shared/BoxOrderStatusLabel'
import { Badge } from '@/components/ui/badge'

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
        return (
          <div
            key={order.id}
            className='rounded-xl p-4 border my-4'
          >
            <div className='flex gap-2'>
              <div>Box</div>
              <div className='font-bold capitalize'>{order.box.name}</div>
              <div className='font-bold ml-auto'>
                {order.quantity} {order.quantity > 1 ? 'Pcs.' : 'Pc.'}
              </div>
            </div>

            <div className='mt-4 flex items-center gap-2'>
              <div>Status:</div>
              <Badge>
                <BoxOrderStatusLabel status={order.status} />
              </Badge>
            </div>
          </div>
        )
      })}
    </div>
  )
}
