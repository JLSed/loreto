import { getServerSession } from 'next-auth'
import LoretoTradingH1, {
  LoretoTradingAbout,
  LoretoTradingImage,
} from './animation-components'
import Navbar from './Navbar'
import { authOptions } from '@/common/configs/auth'
import { UserRole } from '@/common/enums/enums.db'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role === UserRole.Admin) {
    redirect('/dashboard')
  }

  return (
    <div>
      <Navbar />

      <main className='max-w-6xl m-auto p-3 mt-4'>
        <div className='grid grid-cols-2'>
          <div className='mt-16'>
            <LoretoTradingH1 />
            <LoretoTradingAbout />
          </div>
          <div className='mt-8'>
            <LoretoTradingImage />
          </div>
        </div>
      </main>
    </div>
  )
}
