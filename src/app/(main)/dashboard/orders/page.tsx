import OrdersTable from './OrdersTable'
import { getDashboardOrders } from './actions'

export type DashboardOrders = Awaited<ReturnType<typeof getDashboardOrders>>

export default async function Page() {
  const orders = await getDashboardOrders()

  return (
    <div>
      <header className='p-4'>
        <h2>Manage Orders</h2>
      </header>
      <div className='p-4'>
        <OrdersTable orders={orders} />
      </div>
    </div>
  )
}
