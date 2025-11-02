import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getApartments } from './dashboard-apartment-actions'
import { ApartmentsTable } from './apartments-table'
import { apartmentsColumn } from './apartments-column'

export type Apartment = Awaited<ReturnType<typeof getApartments>>[0]
interface Props {
  searchParams: {
    page: number
    perPage: number
  }
}

export default async function Page(props: Props) {
  const apartments = await getApartments({
    page: props.searchParams.page ? +props.searchParams.page : 1,
    perPage: props.searchParams.perPage ? +props.searchParams.perPage : 10,
  })

  return (
    <div className='container mx-auto p-4 sm:p-6 lg:p-8 space-y-6'>
      <header className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold'>
            Apartment Management
          </h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage rental properties and availability
          </p>
        </div>
        <Link href={'/dashboard/apartments/new'}>
          <Button className='w-full sm:w-auto'>
            <span className='sm:hidden'>Add New Apartment</span>
            <span className='hidden sm:inline'>New</span>
          </Button>
        </Link>
      </header>

      {apartments.length === 0 ? (
        <main className='text-center space-y-4 py-12'>
          <div className='mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4'>
            <svg
              className='w-8 h-8 text-muted-foreground'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1'
              />
            </svg>
          </div>
          <h4 className='text-lg font-medium'>No apartments yet</h4>
          <p className='text-sm text-muted-foreground max-w-sm mx-auto'>
            Start managing your rental properties by adding your first
            apartment.
          </p>
          <Link href={'/dashboard/apartments/new'}>
            <Button
              variant={'secondary'}
              className='mt-4'
            >
              Add New Apartment
            </Button>
          </Link>
        </main>
      ) : (
        <div className='overflow-hidden'>
          <ApartmentsTable
            columns={apartmentsColumn}
            data={apartments}
          />
        </div>
      )}
    </div>
  )
}
