import { prisma } from '@/common/configs/prisma'
import { notFound } from 'next/navigation'
import VehicleDetails from './VehicleDetails'

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const data = await prisma.vehicle.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!data) notFound()

  return <VehicleDetails data={data} />
}
