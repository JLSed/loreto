'use client'

import { useTheme } from 'next-themes'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LaptopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

export function ThemeSwitcher(props: { useIcon?: boolean }) {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {props.useIcon ? (
          <Button
            variant={'ghost'}
            size={'icon'}
          >
            {resolvedTheme === 'dark' ? (
              <MoonIcon className='mr-1' />
            ) : (
              <SunIcon className='mr-1' />
            )}
          </Button>
        ) : (
          <DropdownMenuItem className='flex items-center gap-1'>
            {resolvedTheme === 'dark' ? (
              <MoonIcon className='mr-1' />
            ) : (
              <SunIcon className='mr-1' />
            )}
            Theme
          </DropdownMenuItem>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <SunIcon className='mr-2' />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <MoonIcon className='mr-2' />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <LaptopIcon className='mr-2' />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
