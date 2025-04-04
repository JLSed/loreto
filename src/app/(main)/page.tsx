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
        <section className='grid grid-cols-2'>
          <div className='mt-16'>
            <LoretoTradingH1 />
            <LoretoTradingAbout />
          </div>
          <div className='mt-8'>
            <LoretoTradingImage />
          </div>
        </section>

        <ServicesCarousel />

        <HomeBoxesCarousel />

        <footer className='flex items-center justify-center gap-4 mt-24 mb-8'>
          <div>{email}</div>|<div>{contact}</div>
        </footer>
      </main>
    </div>
  )
}
