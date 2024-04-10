'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

export default function ClientSessionProvider(
  props: Readonly<{ session: Session | null; children: React.ReactNode }>
) {
  return (
    <SessionProvider session={props.session}>{props.children}</SessionProvider>
  )
}
