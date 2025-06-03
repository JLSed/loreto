import Link from 'next/link'
import TenantsTable from './tenants-table'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import { getTenants } from './tenants-action'

export default async function Page() {
  const tenants = await getTenants()

  return (
    <div>
      <header className='p-4 flex items-center justify-between'>
        <h2>Tenants</h2>
        <Link
          href={'/dashboard/tenants/new'}
          passHref
        >
          <Button>
            <PlusIcon className='w-4 h-4 mr-1' />
            New Tenant
          </Button>
        </Link>
      </header>
      <div className='p-4'>
        <TenantsTable tenants={tenants} />
      </div>
    </div>
  )
}
