import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import { redirect } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { ThemeSwitcher } from '../dashboard/ThemeSwitcher'
import SignoutButton from '../dashboard/SignoutButton'

export default async function Layout(props: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email,
    },
  })

  if (!user) {
    redirect('/sigin?redirect=/me')
  }

  return (
    <div className='max-w-4xl m-auto'>
      <header className='p-4 flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <Avatar>
            <AvatarImage
              src={user.photoUrl ?? ''}
              alt={user.username}
            />
            <AvatarFallback className='uppercase'>
              {user.username[0]}
            </AvatarFallback>
          </Avatar>
          <div className='capitalize font-bold'>{user.username}</div>
        </div>

        <div className='flex items-center gap-4'>
          <Link href={'/'}> Home </Link>
          <Link href={'/me/bookings'}> Bookings </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'secondary'}
                size={'icon'}
              >
                <HamburgerMenuIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <ThemeSwitcher />
                <SignoutButton />
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {props.children}
    </div>
  )
}
