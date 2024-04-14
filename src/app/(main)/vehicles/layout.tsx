import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { ThemeSwitcher } from '../dashboard/ThemeSwitcher'
import { ReactNode } from 'react'
import SignoutButton from '../dashboard/SignoutButton'
import Link from 'next/link'

export default async function Layout(props: { children: ReactNode }) {
  return (
    <div className='max-w-5xl m-auto'>
      <header className='p-4 py-5 flex items-center justify-between'>
        <h3>Book a vehicle</h3>
        <div className='flex items-center gap-3'>
          <Link href='/'> Home </Link>
          <Link href='/vehicles'> Vehicles </Link>
          <Link href='/me/bookings'>
            <Button variant={'secondary'}>My Bookings</Button>
          </Link>
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
