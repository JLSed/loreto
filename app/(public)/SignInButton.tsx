'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function SignInButton() {
  return (
    <Button
      onClick={() =>
        signIn('google', {
          redirect: true,
          callbackUrl: '/dashboard',
        })
      }
    >
      Sign in
    </Button>
  )
}
