import { prisma } from '@/common/configs/prisma'
import { notFound } from 'next/navigation'
import UpdateUserRole from './UpdateUserRole'

export default async function Page(props: {
  searchParams: {
    userId: string
  }
}) {
  if (!props.searchParams.userId) {
    notFound()
  }

  const user = await prisma.user.findUnique({
    where: {
      id: props.searchParams.userId,
    },
  })

  if (!user) {
    notFound()
  }

  return <UpdateUserRole user={user} />
}
