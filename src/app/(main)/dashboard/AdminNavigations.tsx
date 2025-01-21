'use client'

import { Button } from '@/components/ui/button'
import MaterialIcon from '@/components/ui/material-icon'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

export default function AdminNavigationLink(props: {
  href: string
  label: string
  materialIconName: ComponentProps<typeof MaterialIcon>['name']
}) {
  const pathname = usePathname()

  let isActive = pathname.startsWith(props.href)

  if (props.href === '/dashboard') {
    isActive = pathname === '/dashboard'
  }

  return (
    <Link href={props.href}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn('w-full justify-start hover:bg-rose-50', {
          'bg-rose-100 rounded-none text-rose-700': isActive,
        })}
      >
        <MaterialIcon
          name={props.materialIconName}
          className='mr-2'
        />
        {props.label}
      </Button>
    </Link>
  )
}
