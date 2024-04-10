'use client'

import { useTheme } from 'next-themes'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

export default function FloatingToolbar() {
  const { setTheme, resolvedTheme, theme } = useTheme()

  return (
    <div className='absolute top-0 right-0 m-3 flex items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='secondary'
            size={'icon'}
          >
            {resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mx-4 backdrop-blur'>
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={theme === 'light'}
            onCheckedChange={(checked) => checked && setTheme('light')}
          >
            Light
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === 'dark'}
            onCheckedChange={(checked) => checked && setTheme('dark')}
          >
            Dark
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={theme === 'system'}
            onCheckedChange={(checked) => checked && setTheme('system')}
          >
            System
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
