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
    <div>
      <header className='p-4 border-b flex items-center justify-between'>
        <h2>Apartment Management</h2>
        <Link href={'/dashboard/apartments/new'}>
          <Button>New</Button>
        </Link>
      </header>

      {apartments.length === 0 ? (
        <main className='p-4 text-center space-y-4 my-8'>
          <h4>No apartments yet.</h4>
          <Link href={'/dashboard/apartments/new'}>
            <Button variant={'secondary'}>Add new apartment</Button>
          </Link>
        </main>
      ) : (
        <div className='px-2'>
          <ApartmentsTable
            columns={apartmentsColumn}
            data={apartments}
          />
        </div>
      )}
    </div>
  )
}
