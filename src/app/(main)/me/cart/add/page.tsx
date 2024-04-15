import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import AddToCartComponent from './AddToCartComponent'

interface Props {
  searchParams: {
    box: string
  }
}

export default async function AddToCartPage(props: Props) {
  if (!props.searchParams.box || typeof props.searchParams.box !== 'string') {
    return (
      <div className='text-center p-4 my-12'>
        <div>Seems like this link was broken.</div>
      </div>
    )
  }

  const session = await getServerSession(authOptions)
  if (!session?.user) return notFound()

  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  })
  if (!user) return notFound()

  const box = await prisma.box.findFirst({
    where: {
      id: props.searchParams.box,
    },
    include: {
      markings: true,
      imageMarkings: true,
    },
  })

  if (!box) notFound()

  return (
    <AddToCartComponent
      user={user}
      box={box}
    />
  )
}
