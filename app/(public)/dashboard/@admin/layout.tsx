import { ReactNode } from 'react'

import AdminLayout from './AdminLayout'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/configs/auth'
import { redirect } from 'next/navigation'

export default async function AdminDashboardRootLayout(props: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/')
  }
  return <AdminLayout user={session.user}>{props.children}</AdminLayout>
}
