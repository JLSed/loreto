import EditTenantForm from './EditTenantForm'
import { prisma } from '@/common/configs/prisma'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page(props: PageProps) {
  const params = await props.params
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: +params.id,
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
