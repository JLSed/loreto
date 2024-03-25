import { prisma } from '@/common/configs/prisma'
import { notFound } from 'next/navigation'
import VehicleDetails from './VehicleDetails'

interface Props {
  params: { id: string }
}

export default async function Page(props: Props) {
  const data = await prisma.vehicle.findUnique({
    where: {
      id: props.params.id,
    },
  })

  if (!data) notFound()

  return <VehicleDetails data={data} />
}
