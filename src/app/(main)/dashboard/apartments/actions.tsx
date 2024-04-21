'use server'

import { prisma } from '@/common/configs/prisma'
import { NewApartment } from './new/new-apartment-schema'
import { ModifyApartment } from './[id]/ApartmentDetail'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/configs/auth'
import { AuditAction, AuditAffectedTable } from '@/common/enums/enums.db'

export async function createNewApartment(data: NewApartment) {
  try {
    await prisma.apartment.create({ data })
    return { status: 200 }
  } catch (error) {
    console.log(
      'Error creating new apartment createNewApartment: src/app/(main)/dashboard/apartments/new/actions.tsx',
      error
    )

    return { status: 500, message: 'Internal server error' }
  }
}

export async function getApartmentById(id: string) {
  return await prisma.apartment.findUnique({
    where: { id },
  })
}

export async function modifyApartment(
  id: string,
  payload: Partial<ModifyApartment>
) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!user) {
      return { status: 401, message: 'Unauthorized' }
    }

    return await prisma.$transaction(async (tx) => {
      const old = await tx.apartment.findUnique({
        where: { id },
      })

      if (!old) {
        return { status: 404, message: 'Apartment not found' }
      }

      const updated = await tx.apartment.update({
        where: { id: old.id },
        data: payload,
      })

      await tx.auditLog.create({
        data: {
          action: AuditAction.Modification,
          affectedRowId: updated.id,
          affectedTable: AuditAffectedTable.Vehicle,
          actorId: user.id,
          remark: 'Modified from edit form',
        },
      })

      return { status: 201 }
    })
  } catch (error) {
    console.log(
      'Error creating new apartment createNewApartment: src/app/(main)/dashboard/apartments/new/actions.tsx',
      error
    )
    return { status: 500, message: 'Something went wrong. Please try again.' }
  }
}

export async function deleteApartment(id: string) {
  await prisma.apartment.delete({
    where: { id },
  })
}
