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
    <div className='container mx-auto space-y-6 sm:space-y-8 p-4 sm:p-6 animate-in fade-in duration-500'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top duration-300'>
        <div className='flex items-center gap-3 sm:gap-4'>
          <div className='p-2 sm:p-3 rounded-xl bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20'>
            <svg
              className='w-5 h-5 sm:w-6 sm:h-6 text-accent'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
              />
            </svg>
          </div>
          <div>
            <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground'>
              Box Inventory
            </h1>
            <p className='text-muted-foreground mt-1 text-sm sm:text-base'>
              Manage your box inventory and types
            </p>
          </div>
        </div>
        <div className='animate-in slide-in-from-right duration-300 delay-200'>
          <InventoryActions />
        </div>
      </header>

      {/* Dashboard Cards */}
      <Suspense fallback={<DashboardSkeleton />}>
        <InventoryDashboard data={dashboardData} />
      </Suspense>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6'>
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
