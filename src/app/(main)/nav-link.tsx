'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { useNavbar } from './navbar-context'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-react'

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

export function NavLinksWrapper(props: { children: ReactNode }) {
  const navbar = useNavbar()

  return (
    <div
      className={cn(
        'gap-4 p-3 pb-8 flex items-start flex-col absolute left-0 top-16 right-0 transition duration-300 opacity-0 pointer-events-none',
        'lg:flex-row lg:pointer-events-auto lg:opacity-100 lg:relative lg:items-center lg:gap-8 lg:top-0 lg:p-0',
        {
          'opacity-100 shadow pointer-events-auto': navbar.isOpen,
        }
      )}
    >
      {props.children}
    </div>
  )
}

export function NavbarToggleButton() {
  const navbar = useNavbar()

  return (
    <Button
      className='active:scale-90 lg:hidden'
      onClick={navbar.toggleNavbar}
      variant={'secondary'}
      size={'icon'}
    >
      <MenuIcon />
    </Button>
  )
}
