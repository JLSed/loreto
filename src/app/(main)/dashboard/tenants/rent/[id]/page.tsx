import { notFound } from 'next/navigation'
import { prisma } from '@/common/configs/prisma'
import { Button } from '@/components/ui/button'
import RentDueDatesTable from '../rent-duedates-table'
import { pesos } from '@/lib/utils'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default async function TenantRentDetailPage(props: PageProps) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: +props.params.id },
  })

  if (!tenant) return notFound()

  return (
    <main className='p-8'>
      <div className=' mb-8'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold mb-4'>Tenant Details</h2>
          <Link href={'/dashboard/tenants'}>
            <Button variant='secondary'>Go Back</Button>
          </Link>
        </div>
        <div className='grid grid-cols-3 '>
          <div className=''>
            <p className='text-xl'>
              <strong>
                {tenant.firstName} {tenant.lastName}
              </strong>
            </p>
            <p>{tenant.emailAddress}</p>
            <p>{tenant.contactNumber || '-'}</p>
          </div>
          <div className=''>
            <p>Rent Fee:</p>
            {pesos(tenant.monthlyPayment)} every {tenant.monthlyDueDate}th
          </div>
          <div className=''>
            <p>Move In Date:</p>
            {tenant.moveInDate.toDateString()}
          </div>
        </div>
      </div>
      <RentDueDatesTable
        monthlyPayment={tenant.monthlyPayment}
        tenantId={tenant.id}
      />
    </main>
  )
}
