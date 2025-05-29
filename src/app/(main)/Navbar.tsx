import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import Image from 'next/image'
import { UserRole } from '@/common/enums/enums.db'
import { authOptions } from '@/common/configs/auth'
import dynamic from 'next/dynamic'
import NavLink, { NavbarToggleButton, NavLinksWrapper } from './nav-link'
import { MenuIcon } from 'lucide-react'

const SignInButton = dynamic(() => import('./SignInButton'), { ssr: false })

const HomeLinkTitle = (
  <Link href={'/'}>
    <div className='font-bold flex items-center gap-3'>
      <Image
        src={'/logo.png'}
        alt=''
        width={30}
        height={30}
      />
      {/* Intended tobe removed: May 29, 2025 */}
      {/* <span>Loreto Trading</span> */}
    </div>
  </Link>
)

export default async function Navbar() {
  const session = await getServerSession(authOptions)

  const getAction = () => {
    if (!session?.user)
      return (
        <>
          <SignInButton />
          <Link href={'/signup'}>
            <Button>Sign up</Button>
          </Link>
        </>
      )

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
    <nav className='flex gap-4 items-center max-w-6xl m-auto p-3 justify-between'>
      {HomeLinkTitle}
      <NavLinksWrapper>
        <NavLink href={'/'}>Home</NavLink>
        <NavLink href={'/apartments'}>Apartments</NavLink>
        <NavLink href={'/vehicles/'}>Book a Vehicle</NavLink>
        <NavLink href={'/box'}>Custom Box</NavLink>

        <div className='space-x-4'>{getAction()}</div>
      </NavLinksWrapper>
      <NavbarToggleButton />
    </nav>
  )
}
