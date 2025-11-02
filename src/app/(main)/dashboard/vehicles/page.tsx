import { prisma } from '@/common/configs/prisma'
import { DataTable } from './data-table'
import { vehiclesTableColumns } from './columns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusIcon } from '@radix-ui/react-icons'

export default async function Page() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold'>Fleet Management</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage your vehicle fleet and availability
          </p>
        </div>
        <Link href='/dashboard/vehicles/new'>
          <Button className='w-full sm:w-auto'>
            <PlusIcon className='mr-2' />
            <span className='sm:hidden'>Add New Vehicle</span>
            <span className='hidden sm:inline'>New</span>
          </Button>
        </Link>
      </header>
      <div className='overflow-hidden'>
        <DataTable
          columns={vehiclesTableColumns}
          data={vehicles}
        />
      </div>
    </div>
  )
}
