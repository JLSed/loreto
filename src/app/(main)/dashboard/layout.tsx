import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { authOptions } from '@/common/configs/auth'
import { UserRole } from '@/common/enums/enums.db'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage(props: {
  children: ReactNode
  admin: ReactNode
  staff: ReactNode
  customer: ReactNode
}) {
  const session = await getServerSession(authOptions)
  const user = session?.user

  if (!user) {
    redirect('/')
  }

  const PageMap: Record<UserRole, ReactNode> = {
    [UserRole.Admin]: props.admin,
    [UserRole.Staff]: props.staff,
    [UserRole.Customer]: props.customer,
  }

  return PageMap[user.role as UserRole]
}
