import { getServerSession } from 'next-auth'
import LoretoTradingH1, {
  LoretoTradingAbout,
  LoretoTradingImage,
} from './animation-components'
import Navbar from './Navbar'
import { authOptions } from '@/common/configs/auth'
import { UserRole } from '@/common/enums/enums.db'
import { redirect } from 'next/navigation'

import HomeBoxesCarousel from './home-boxes-carousel'
import ServicesCarousel from './services-carousel'
import { contact, email } from '@/lib/constants'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role === UserRole.Admin) {
    redirect('/dashboard')
  }

  return (
    <div>
      <Navbar />

      <main className='max-w-6xl m-auto p-3 mt-4'>
        <section className='grid grid-cols-1 md:grid-cols-2'>
          <div className='mt-16'>
            <LoretoTradingH1 />
            <LoretoTradingAbout />
          </div>
          <div className='mt-8'>
            <LoretoTradingImage />
          </div>
        </section>

        <div className='animate-in fade-in duration-700 delay-500'>
          <ServicesCarousel />
        </div>

        <div className='animate-in fade-in duration-700 delay-700'>
          <HomeBoxesCarousel />
        </div>

        <footer className='flex items-center justify-center gap-4 mt-24 mb-8 animate-in fade-in duration-500 delay-1000'>
          <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-background transition-colors'>
            <svg
              className='w-4 h-4 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
              />
            </svg>
            {email}
          </div>
          <div className='text-gray-400'>|</div>
          <div className='flex items-center gap-2 px-4 py-2 rounded-lg bg-background transition-colors'>
            <svg
              className='w-4 h-4 text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
              />
            </svg>
            {contact}
          </div>
        </footer>
      </main>
    </div>
  )
}
