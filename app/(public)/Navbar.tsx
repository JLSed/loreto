import { Button } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import SignInButton from './SignInButton'
import Image from 'next/image'
import SignOutButton from './SignOutButton'

export default async function Navbar() {
  const session = await getServerSession()

  if (!session?.user) {
    return (
      <nav>
        <SignInButton />
      </nav>
    )
  }

  const user = session.user

  return (
    <nav className='flex gap-4 items-center'>
      <div>{user.name}</div>
      {user.image && (
        <div>
          <Image
            src={user.image}
            alt=''
            width={100}
            height={100}
            className='rounded-full'
          />
        </div>
      )}
      <Link href={'/dashboard'}>
        <Button>Dashboard</Button>
      </Link>
      <SignOutButton />
    </nav>
  )
}
