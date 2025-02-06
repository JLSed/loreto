import { getServerSession } from 'next-auth'
import LoretoTradingH1, {
  LoretoTradingAbout,
  LoretoTradingImage,
} from './animation-components'
import Navbar from './Navbar'
import { authOptions } from '@/common/configs/auth'
import { UserRole } from '@/common/enums/enums.db'
import { redirect } from 'next/navigation'
import Image from 'next/image'

import Box1 from '@/assets/images/box1.jpeg'
import Box2 from '@/assets/images/box2.jpeg'
import Box3 from '@/assets/images/box3_inside.jpeg'
import Box4 from '@/assets/images/box3_top.jpeg'
import Box5 from '@/assets/images/box3.jpeg'
import Box6 from '@/assets/images/box3_inside2.jpeg'

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

        <section className='columns-3 mt-24'>
          <Image
            alt=''
            src={Box1}
            className='break-inside-avoid-column mb-4 p-2'
          />
          <Image
            alt=''
            src={Box2}
            className='break-inside-avoid-column mb-4 p-2'
          />
          <Image
            alt=''
            src={Box3}
            className='break-inside-avoid-column mb-4 p-2'
          />
          <Image
            alt=''
            src={Box4}
            className='break-inside-avoid-column mb-4 p-2'
          />
          <Image
            alt=''
            src={Box5}
            className='break-inside-avoid-column mb-4 p-2'
          />
          <Image
            alt=''
            src={Box6}
            className='break-inside-avoid-column mb-4 p-2'
          />
        </section>

        <footer className='flex items-center justify-center gap-4 mt-24'>
          <div>loretotrdng@gmail.com</div>|<div>0932-323-1343</div>
        </footer>
      </main>
    </div>
  )
}
