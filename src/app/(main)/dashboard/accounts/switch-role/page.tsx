import { prisma } from '@/common/configs/prisma'
import { notFound } from 'next/navigation'
import UpdateUserRole from './UpdateUserRole'

export default async function Page(props: {
  searchParams: Promise<{
    userId?: string
  }>
}) {
  const searchParams = await props.searchParams
  if (!searchParams.userId) {
    notFound()
  }

  const user = await prisma.user.findUnique({
    where: {
      id: searchParams.userId,
    },
  })

  if (!user) {
    notFound()
  }

  return <UpdateUserRole user={user} />
}
