import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function Page() {
  return (
    <div>
      <header className='p-4 border-b flex items-center justify-between'>
        <h2>Apartment Management</h2>
        <Link href={'/dashboard/apartments/new'}>
          <Button>New</Button>
        </Link>
      </header>

      <main className='p-4'>No data yet</main>
    </div>
  )
}
