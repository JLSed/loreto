'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ExitIcon } from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'

export default function SignoutButton() {
  return (
    <DropdownMenuItem
      className='flex items-center gap-1'
      onClick={() => {
        if (confirm('Are you sure you want to sign out?')) {
          localStorage.clear()
          signOut({ callbackUrl: '/', redirect: true })
        }
      }}
    >
      <ExitIcon className='mr-1' />
      Sign out
    </DropdownMenuItem>
  )
}
