import EditTenantForm from './EditTenantForm'
import { prisma } from '@/common/configs/prisma'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export default async function Page(props: PageProps) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: +props.params.id,
    },
  })
  if (!tenant) notFound()

  // Get the apartment associated with this tenant
  const apartment = await prisma.apartment.findFirst({
    where: {
      tenantId: tenant.id,
    },
  })

  return (
    <EditTenantForm
      tenant={tenant}
      apartment={apartment}
    />
  )
}
