import Navbar from '../Navbar'
import { prisma } from '@/common/configs/prisma'
import Apartments from './Apartments'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Page() {
  const apartments = await prisma.apartment.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <Navbar />
      <main className='max-w-6xl m-auto p-3 my-4'>
        <header className='p-4 py-5 flex justify-between'>
          <h3 className='mb-4'>Apartments</h3>
          <Link href={'/'}>
            <Button variant='secondary'>Return Home</Button>
          </Link>
        </header>
        <Apartments apartments={apartments} />
      </main>
    </div>
  )
}
