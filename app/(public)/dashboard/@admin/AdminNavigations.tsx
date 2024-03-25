'use client'

import { Button } from '@/components/ui/button'
import MaterialIcon from '@/components/ui/material-icon'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

export default function AdminNavigationLink(props: {
  href: string
  label: string
  materialIconName: ComponentProps<typeof MaterialIcon>['name']
}) {
  const pathname = usePathname()

  return (
    <Link href={props.href}>
      <Button
        variant={pathname.startsWith(props.href) ? 'secondary' : 'ghost'}
        className='w-full justify-start'
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
