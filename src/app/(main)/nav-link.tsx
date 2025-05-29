'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface Props {
  href: string
  children: ReactNode
}

export default function NavLink({ href, children }: Props) {
  const pathname = usePathname()

  return (
    <Link
      className={cn('hover:text-rose-500', {
        'text-rose-500 font-semibold': pathname === href,
      })}
      href={href}
    >
      {children}
    </Link>
  )
}
