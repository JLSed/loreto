'use client'

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function Page(props: { searchParams: { redirect?: string } }) {
  const redirect = props.searchParams.redirect

  return (
    <div className='text-center px-4 py-14 space-y-8'>
      <h3>Please sign in to continue</h3>
      <div>
        <Button
          onClick={() => {
            signIn('google', {
              callbackUrl: redirect ? decodeURI(redirect) : '/',
              redirect: true,
            })
          }}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
