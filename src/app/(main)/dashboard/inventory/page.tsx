import { Suspense } from 'react'
import {
  getInventoryDashboardData,
  getBoxInventory,
  getBoxTypes,
} from './inventory-actions'
import { InventoryDashboard } from './components/InventoryDashboard'
import { InventoryTable } from './components/InventoryTable'
import { BoxTypeManagement } from './components/BoxTypeManagement'
import { InventoryActions } from './components/InventoryActions'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default async function InventoryPage() {
  const [dashboardData, inventory, boxTypes] = await Promise.all([
    getInventoryDashboardData(),
    getBoxInventory(),
    getBoxTypes(),
  ])

  return (
    <div className='space-y-6 p-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold tracking-tight'>Box Inventory</h1>
        <InventoryActions />
      </header>

      {/* Dashboard Cards */}
      <Suspense fallback={<DashboardSkeleton />}>
        <InventoryDashboard data={dashboardData} />
      </Suspense>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Box Type Management */}
        <Card className='lg:col-span-1'>
          <div className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>Box Types</h3>
            <BoxTypeManagement boxTypes={boxTypes} />
          </div>
        </Card>

        {/* Inventory Table */}
        <Card className='lg:col-span-2'>
          <div className='p-6'>
            <h3 className='text-lg font-semibold mb-4'>Inventory</h3>
            <Suspense fallback={<TableSkeleton />}>
              <InventoryTable
                data={inventory}
                boxTypes={boxTypes}
              />
            </Suspense>
          </div>
        </Card>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <div className='p-6'>
            <Skeleton className='h-4 w-24 mb-2' />
            <Skeleton className='h-8 w-16' />
          </div>
        </Card>
      ))}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-10 w-full' />
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className='h-16 w-full'
        />
      ))}
    </div>
  )
}
