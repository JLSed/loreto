'use client'

import { Button } from '@/components/ui/button'
import { ExitIcon } from '@radix-ui/react-icons'
import { signOut } from 'next-auth/react'

export default function SignOutButton(props: { iconOnly?: boolean }) {
  if (props.iconOnly) {
    return (
      <Button
        size={'icon'}
        variant={'secondary'}
        onClick={() =>
          signOut({
            callbackUrl: '/',
          })
        }
      >
        <ExitIcon />
      </Button>
    )
  }
  return (
    <Button
      size={'sm'}
      variant={'secondary'}
      onClick={() =>
        signOut({
          callbackUrl: '/',
        })
      }
    >
      <ExitIcon className='mr-2' />
      Sign out
    </Button>
  )
}
