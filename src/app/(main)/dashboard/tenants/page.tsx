import Link from 'next/link'
import TenantsTable from './tenants-table'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { getTenants } from './tenants-action'

export default async function Page() {
  const tenants = await getTenants()

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold'>Tenant Management</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage tenant information and rental agreements
          </p>
        </div>
        <Link
          href={'/dashboard/tenants/new'}
          passHref
        >
          <Button className='w-full sm:w-auto'>
            <PlusIcon className='w-4 h-4 mr-1' />
            <span className='sm:hidden'>Add New Tenant</span>
            <span className='hidden sm:inline'>New Tenant</span>
          </Button>
        </Link>
      </header>
      <div className='overflow-hidden'>
        <TenantsTable tenants={tenants} />
      </div>
    </div>
  )
}
