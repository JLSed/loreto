'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function SignInButton() {
  return (
    <Button
      onClick={async () => {
        await signIn('google', {
          redirect: true,
          callbackUrl: '/',
        })
      }}
    >
      Sign in
    </Button>
  )
}
