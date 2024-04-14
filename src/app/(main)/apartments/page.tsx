import Navbar from '../Navbar'
import { prisma } from '@/common/configs/prisma'
import Apartments from './Apartments'

export default async function Page() {
  const apartments = await prisma.apartment.findMany()

  return (
    <div>
      <Navbar />

      <main className='max-w-5xl m-auto p-3 my-4'>
        <h3 className='mb-4'>Apartments</h3>

        <Apartments apartments={apartments} />
      </main>
    </div>
  )
}
