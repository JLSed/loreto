import { prisma } from '@/common/configs/prisma'
import BoxPreview from './BoxPreview'
import { notFound } from 'next/navigation'

interface PageProps {
  searchParams: {
    box: string
  }
}

const getBoxDetails = async (id: string) => {
  const b = await prisma.box.findUnique({
    where: { id: id },
    include: {
      markings: true,
      imageMarkings: true,
    },
  })
  if (!b) notFound()
  return b
}

export type BoxDetails = Awaited<ReturnType<typeof getBoxDetails>>

export default async function Page(props: PageProps) {
  const box = await getBoxDetails(props.searchParams.box)

  return (
    <BoxPreview
      box={box}
      markings={box.markings}
      imageMarkings={box.imageMarkings}
    />
  )
}
