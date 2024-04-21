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
    <div>
      <header className='p-4 flex items-center justify-between'>
        <h2>Vehicles</h2>
        <Link href='/dashboard/vehicles/new'>
          <Button>
            <PlusIcon className='mr-2' /> New
          </Button>
        </Link>
      </header>
      <div className='px-4'>
        <DataTable
          columns={vehiclesTableColumns}
          data={vehicles}
        />
      </div>
    </div>
  )
}
