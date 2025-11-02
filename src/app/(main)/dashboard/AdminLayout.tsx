'use client'

import { ReactNode, useState, useEffect } from 'react'
import { UserRole } from '@/common/enums/enums.db'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UserRoleLabel } from '@/common/constants/business'

import { Session } from 'next-auth'
import SignoutButton from './SignoutButton'
import { ThemeSwitcher } from './ThemeSwitcher'
import AdminNavigationLink from './AdminNavigations'

export default function AdminLayout(props: {
  children: ReactNode
  user: Session['user']
}) {
  const user = props.user
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Close sidebar on desktop resize and handle mobile drawer behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isSidebarOpen])

  return (
    <div className='min-h-screen bg-background'>
      {/* Mobile Header */}
      <div className='md:hidden sticky top-0 z-40 flex items-center justify-between p-4 border-b bg-card/80 backdrop-blur-sm'>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 rounded-lg hover:bg-muted transition-colors'
          aria-label='Toggle navigation'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d={
                isSidebarOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>

        <div className='flex items-center gap-2'>
          <Badge className='capitalize text-xs'>
            {UserRoleLabel[user.role as UserRole]}
          </Badge>
          <ThemeSwitcher useIcon />
        </div>
      </div>

      <div className='flex'>
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-card border-r transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:w-80 lg:w-72
          flex flex-col
        `}
        >
          {/* User Profile Section */}
          <div className='flex items-center gap-3 p-4 border-b'>
            <Avatar className='h-10 w-10'>
              <AvatarImage
                src={user.image ?? ''}
                alt={user.name}
              />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className='flex-1 min-w-0'>
              <div className='text-sm font-medium capitalize truncate'>
                {user.name}
              </div>
              <div className='text-xs text-muted-foreground truncate'>
                {user.email}
              </div>
            </div>
            <Badge className='capitalize text-xs hidden md:block'>
              {UserRoleLabel[user.role as UserRole]}
            </Badge>
          </div>

          {/* Navigation */}
          <nav className='flex-1 overflow-y-auto py-2 h-svh'>
            <div className='flex flex-col px-3 space-y-2'>
              <AdminNavigationLink
                label='Dashboard'
                href='/dashboard'
                materialIconName='dashboard'
              />
              <AdminNavigationLink
                label='Sales Report'
                href='/dashboard/sales-report'
                materialIconName='bar_chart'
              />
              <AdminNavigationLink
                label='Apartments'
                href='/dashboard/apartments'
                materialIconName='other_houses'
              />
              <AdminNavigationLink
                label='Apartment Inquiries'
                href='/dashboard/apartment-inquiries'
                materialIconName='help_center'
              />
              <AdminNavigationLink
                label='Audit Logs'
                href='/dashboard/auditlogs'
                materialIconName='person_edit'
              />
              <AdminNavigationLink
                label='Bookings'
                href='/dashboard/bookings'
                materialIconName='directions_car'
              />
              <AdminNavigationLink
                label='Manage Accounts'
                href='/dashboard/accounts'
                materialIconName='manage_accounts'
              />
              <AdminNavigationLink
                label='Box Orders'
                href='/dashboard/orders'
                materialIconName='orders'
              />
              <AdminNavigationLink
                label='Box Inventory'
                href='/dashboard/inventory'
                materialIconName='inventory'
              />
              <AdminNavigationLink
                label='Vehicles'
                href='/dashboard/vehicles'
                materialIconName='local_shipping'
              />
              <AdminNavigationLink
                label='Tenants'
                href='/dashboard/tenants'
                materialIconName='location_home'
              />
            </div>
          </nav>

          {/* Settings Footer */}
          <div className='border-t p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>Settings</span>
              <div className='flex items-center gap-2'>
                <SignoutButton useButton />
                <div className='hidden md:block'>
                  <ThemeSwitcher useIcon />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 z-40 bg-black/50 md:hidden'
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className='flex-1 md:ml-0'>{props.children}</main>
      </div>
    </div>
  )
}
