import { authOptions } from '@/common/configs/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Toaster } from 'sonner'

export default async function Layout(props: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/sigin?redirect=/me')
  }
  const user = session.user

  return (
    <div className='max-w-4xl m-auto'>
      <header className='p-4 flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <Avatar>
            <AvatarImage
              src={user.image ?? ''}
              alt={user.name}
            />
            <AvatarFallback className='uppercase'>
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className='capitalize font-bold'>Hi, {user.name}</div>
        </div>

        <div className='flex items-center gap-6'>
          <Link href={'/'}> Home </Link>
          <Link href={'/me/bookings'}> Bookings </Link>
          <Link href={'/me/boxes'}> Boxes </Link>
          <Link href={'/me/cart'}> Cart </Link>
        </div>
      </header>

      {props.children}
      <Toaster />
    </div>
  )
}
