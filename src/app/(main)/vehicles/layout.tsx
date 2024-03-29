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

export default async function Layout(props: { children: ReactNode }) {
  return (
    <div className='max-w-4xl m-auto'>
      <header className='p-4 py-5 flex items-center justify-between'>
        <h3>Book a vehicle</h3>
        <div className='flex items-center gap-3'>
          <Button variant={'secondary'}>My Bookings</Button>
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {props.children}
    </div>
  )
}
