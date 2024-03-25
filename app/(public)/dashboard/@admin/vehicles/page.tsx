import { prisma } from '@/common/configs/prisma'
import { DataTable } from './data-table'
import { vehiclesTableColumns } from './columns'

export default async function Page() {
  const vehicles = await prisma.vehicle.findMany()

  return (
    <div>
      <header className='p-4'>
        <h2>Vehicles</h2>
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
