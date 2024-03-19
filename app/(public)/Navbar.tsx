import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import SignInButton from './SignInButton'
import Image from 'next/image'

const HomeLinkTitle = (
  <Link href={'/'}>
    <div className='font-bold flex items-center gap-3'>
      <Image
        src={'/logo.png'}
        alt=''
        width={30}
        height={30}
      />
      <span>Loreto Trading</span>
    </div>
  </Link>
)

export default async function Navbar() {
  const session = await getServerSession()

  if (!session?.user) {
    return (
      <nav className='flex gap-4 items-center max-w-4xl m-auto p-3'>
        {HomeLinkTitle}
        <div className='space-x-2 ml-auto'>
          <SignInButton />
        </div>
      </nav>
    )
  }

  return (
    <nav className='flex gap-4 items-center max-w-4xl m-auto p-3 sticky top-0'>
      {HomeLinkTitle}

      <div className='space-x-2 ml-auto'>
        <Link href={'/dashboard'}>
          <Button>Dashboard</Button>
        </Link>
      </div>
    </nav>
  )
}
