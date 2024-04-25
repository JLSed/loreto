'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ExitIcon } from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'

export default function SignoutButton(props: { useButton?: boolean }) {
  if (props.useButton) {
    return (
      <Button
        className='flex items-center gap-1'
        onClick={() => {
          if (confirm('Are you sure you want to sign out?')) {
            localStorage.clear()
            signOut({ callbackUrl: '/', redirect: true })
          }
        }}
        variant={'ghost'}
        size={'icon'}
      >
        <ExitIcon className='mr-1' />
      </Button>
    )
  }
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
