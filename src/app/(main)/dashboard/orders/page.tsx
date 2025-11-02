import OrdersTable from './OrdersTable'
import { getDashboardOrders } from './actions'

export type DashboardOrders = Awaited<ReturnType<typeof getDashboardOrders>>

export default async function Page() {
  const orders = await getDashboardOrders()

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      <header>
        <h2 className='text-xl sm:text-2xl font-bold'>Box Orders</h2>
        <p className='text-sm text-muted-foreground mt-1'>
          Manage custom box orders and their status
        </p>
      </header>
      <div className='overflow-hidden'>
        <OrdersTable orders={orders} />
      </div>
    </div>
  )
}
