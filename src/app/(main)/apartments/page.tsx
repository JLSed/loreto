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
        <header className='p-4 py-5 flex justify-between items-center animate-in slide-in-from-top duration-500'>
          <div className='space-y-2'>
            <h3 className='text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
              Available Apartments
            </h3>
            <p className='text-gray-600 text-sm'>
              Find your perfect rental home
            </p>
          </div>

        </header>
        <div className='animate-in fade-in duration-500 delay-200'>
          <Apartments apartments={apartments} />
        </div>
      </main>
    </div>
  )
}
