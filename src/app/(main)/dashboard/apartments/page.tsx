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

      <main className='p-4 text-center space-y-4 my-8'>
        <h4>No apartments yet.</h4>
        <Link href={'/dashboard/apartments/new'}>
          <Button variant={'secondary'}>Add new apartment</Button>
        </Link>
      </main>
    </div>
  )
}
