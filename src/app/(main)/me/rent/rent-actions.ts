'use server'

import { prisma } from '@/common/configs/prisma'
import { authOptions } from '@/common/configs/auth'
import { getServerSession } from 'next-auth'

export async function checkIfUserIsTenant() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      emailAddress: session.user.email,
    },
  })

  return tenant
}

export async function getCurrentUserTenantDetails() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  const tenant = await prisma.tenant.findFirst({
    where: {
      emailAddress: session.user.email,
    },
    include: {
      Transaction: true,
    },
  })

  if (!tenant) return null

  // Get the apartment associated with this tenant
  const apartment = await prisma.apartment.findFirst({
    where: {
      tenantId: tenant.id,
    },
  })

  return {
    ...tenant,
    apartment,
  }
}
