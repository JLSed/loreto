'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import MaterialIcon from '@/components/ui/material-icon'
import { signOut } from 'next-auth/react'
import React from 'react'

export default function SignoutButton() {
  return (
    <DropdownMenuItem
      className='flex items-center gap-1'
      onClick={() => signOut({ callbackUrl: '/', redirect: true })}
    >
      <MaterialIcon name='power_settings_new' />
      Sign out
    </DropdownMenuItem>
  )
}
