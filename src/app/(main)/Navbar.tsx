import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import SignInButton from './SignInButton'
import Image from 'next/image'
import { UserRole } from '@/common/enums/enums.db'
import { authOptions } from '@/common/configs/auth'

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
  const session = await getServerSession(authOptions)

  const getAction = () => {
    if (!session?.user) return <SignInButton />

    if (session.user.role == UserRole.Admin) {
      return (
        <Link href={'/dashboard'}>
          <Button>Dashboard</Button>
        </Link>
      )
    }

    if (session.user.role == UserRole.Customer) {
      return (
        <Link href={'/me'}>
          <Button variant={'secondary'}>My Account</Button>
        </Link>
      )
    }
  }

  return (
    <nav className='flex gap-4 items-center max-w-4xl m-auto p-3'>
      {HomeLinkTitle}
      <div className='gap-8 ml-auto flex items-center'>
        <Link href={'/apartments'}>Apartments</Link>
        <Link href={'/vehicles/'}>Book a Vehicle</Link>
        <Link href={'/box'}>Custom Box</Link>

        {getAction()}
      </div>
    </nav>
  )
}
