'use server'

import { prisma } from '@/common/configs/prisma'
import { TenantStatus } from '@/common/enums/enums.db'
import { Tenant } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface UtilityTransaction {
  fromTenantId: number
  modeOfPayment: number
  type: number
  itemType: number
  amount: number
}

export async function createUtilityTransaction(data: UtilityTransaction) {
  try {
    const transaction = prisma.transaction.create({
      data: {
        fromTenantId: data.fromTenantId,
        modeOfPayment: data.modeOfPayment,
        fromUserId: null,
        type: data.type, // 1: full payment
        itemType: data.itemType, // 3: apartment/utilities
        amount: data.amount,
      },
    })
    return { status: 201, data: transaction }
  } catch (error) {
    console.error(error)
    return { status: 500, message: 'Failed to create transaction' }
  }
}

export async function getTenants() {
  return await prisma.tenant.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function addNewTenant(input: TNewTenant) {
  try {
    // Validate contact number
    if (!/^[0-9]{11}$/.test(input.contactNumber)) {
      return false
    }

    // Get the apartment to get its monthly rental price
    const apartment = await prisma.apartment.findUnique({
      where: { id: input.apartmentId },
      select: { monthlyRentalPrice: true, availability_status: true },
    })

    if (!apartment) {
      throw new Error('Apartment not found')
    }

    if (apartment.availability_status !== 0) {
      throw new Error('Apartment is not available')
    }

    // Use a transaction to create tenant and update apartment
    const result = await prisma.$transaction(async (tx) => {
      // Create tenant with apartment's monthly rental price
      const { apartmentId, ...tenantData } = input
      const added = await tx.tenant.create({
        data: {
          ...tenantData,
          moveInDate: new Date(input.moveInDate),
          monthlyPayment: apartment.monthlyRentalPrice,
        },
      })

      // Update apartment to mark as occupied
      await tx.$executeRaw`
        UPDATE "Apartment" 
        SET availability_status = 1, "tenantId" = ${added.id}
        WHERE id = ${input.apartmentId}
      `

      return added
    })

    if (result) {
      revalidatePath('/dashboard/tenants')
      return true
    }
    return false
  } catch (error) {
    console.error('Error adding new tenant:', error)
    return false
  }
}

export async function updateTenantStatus(params: {
  tenantId: number
  status: TenantStatus
}) {
  await prisma.tenant.update({
    where: { id: params.tenantId },
    data: {
      status: params.status,
    },
  })
  revalidatePath('/dashboard/tenants')
}

export async function updateTenantInfo(
  tenantId: number,
  input: Partial<Tenant>
) {
  if (input.moveInDate) {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        ...input,
        moveInDate: new Date(input.moveInDate),
      },
    })
  } else {
    await prisma.tenant.update({
      where: { id: tenantId },
      data: input,
    })
  }
  revalidatePath('/dashboard/tenants')
}

export async function deleteTenant(id: number) {
  await prisma.tenant.delete({
    where: { id },
  })
  revalidatePath('/dashboard/tenants')
}

// Types
export type TGetTenants = Awaited<ReturnType<typeof getTenants>>
export type TNewTenant = {
  firstName: string
  lastName: string
  contactNumber: string
  moveInDate: string
  monthlyDueDate: number
  apartmentId: string
  emailAddress: string
}
