import { ReactNode } from 'react'
import { UserRole } from '@/common/enums/enums.db'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserRoleLabel } from '@/common/constants/business'
import MaterialIcon from '@/components/ui/material-icon'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Session } from 'next-auth'
import SignoutButton from '../SignoutButton'
import { ThemeSwitcher } from '../ThemeSwitcher'
import AdminNavigationLink from './AdminNavigations'

export default function AdminLayout(props: {
  children: ReactNode
  user: Session['user']
}) {
  const user = props.user

  return (
    <main className='grid grid-cols-[auto_1fr]'>
      <aside className='sticky top-0 h-screen border-r'>
        <div className='flex items-center gap-2 p-4'>
          <Avatar>
            <AvatarImage
              src={user.image ?? ''}
              alt={user.name}
            />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className='text-sm font-medium capitalize'>{user.name}</div>
            <div className='text-xs text-muted-foreground'>{user.email}</div>
          </div>
          <Badge
            variant={'secondary'}
            className='ml-2 capitalize'
          >
            {UserRoleLabel[user.role as UserRole]}
          </Badge>
        </div>

        <nav className='flex flex-col gap-1'>
          <AdminNavigationLink
            label='Dashboard'
            href='/dashboard/home'
            materialIconName='dashboard'
          />

          <AdminNavigationLink
            label='Apartments'
            href='/dashboard/apartments'
            materialIconName='other_houses'
          />

          <AdminNavigationLink
            label='Audit Logs'
            href='/dashboard/auditlogs'
            materialIconName='person_edit'
          />

          <AdminNavigationLink
            label='Box Packaging'
            href='/dashboard/box'
            materialIconName='package_2'
          />

          <AdminNavigationLink
            label='Manage Accounts'
            href='/dashboard/accounts'
            materialIconName='manage_accounts'
          />

          <AdminNavigationLink
            label='Orders'
            href='/dashboard/orders'
            materialIconName='orders'
          />

          <AdminNavigationLink
            label='Transactions'
            href='/dashboard/transactions'
            materialIconName='receipt_long'
          />

          <AdminNavigationLink
            label='Vehicles'
            href='/dashboard/vehicles'
            materialIconName='local_shipping'
          />
        </nav>

        <div className='flex items-center justify-between absolute bottom-0 right-0 left-0 p-4'>
          <div className='text-muted-foreground text-sm'>Settings</div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'ghost'}
                size={'icon'}
              >
                <MaterialIcon name='settings' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel className='text-xs'>
                Settings
              </DropdownMenuLabel>
              <SignoutButton />
              <ThemeSwitcher />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {props.children}
    </main>
  )
}
