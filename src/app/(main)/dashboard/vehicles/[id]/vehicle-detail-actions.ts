'use server'

import { cloud } from '@/common/configs/cloud'
import { UpdateVehicleInput } from './VehicleDetails'
import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/configs/auth'
import {
  AuditAction,
  AuditAffectedTable,
  VehicleStatus,
} from '@/common/enums/enums.db'
import { format } from 'date-fns'
import { VehicleStatusLabel } from '@/common/constants/business'

export async function updateVehicleAction(input: UpdateVehicleInput) {
  try {
    return await prisma.$transaction(async (tx) => {
      const session = await getServerSession(authOptions)
      if (!session?.user.id) {
        return { status: 401 }
      }

      let photoUrl: string | undefined

      if (input.newPhotoUrl) {
        const cloudResponse = await cloud.uploader.upload(input.newPhotoUrl, {
          public_id: `vehicle-${input.name}`,
          overwrite: true,
          filename_override: `vehicle-${input.name}`,
          folder: 'loreto',
        })
        photoUrl = cloudResponse.secure_url
      }

      delete input.newPhotoUrl

      const old = await tx.vehicle.findUnique({
        where: { id: input.id },
      })

      if (!old) {
        return { status: 404 }
      }

      const updated = await tx.vehicle.update({
        where: { id: input.id },
        data: {
          ...input,
          photoUrl: photoUrl ? photoUrl : input.photoUrl,
          serviceFeePerHour: input.serviceFeePerHour
            ? parseFloat(input.serviceFeePerHour)
            : undefined,
          purchaseDate: input.purchaseDate
            ? new Date(input.purchaseDate)
            : undefined,
          lastMaintenance: input.lastMaintenance
            ? new Date(input.lastMaintenance)
            : undefined,
        },
      })

      await Promise.all([
        old.name !== updated.name &&
          tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: AuditAction.Modification,
              affectedTable: AuditAffectedTable.Vehicle,
              affectedRowId: updated.id,
              columnName: 'name',
              from: old.name,
              to: updated.name,
            },
          }),
        old.model !== updated.model &&
          tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: AuditAction.Modification,
              affectedTable: AuditAffectedTable.Vehicle,
              affectedRowId: updated.id,
              columnName: 'model',
              from: old.model,
              to: updated.model,
            },
          }),
        old.plateNumber !== updated.plateNumber &&
          tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: AuditAction.Modification,
              affectedTable: AuditAffectedTable.Vehicle,
              affectedRowId: updated.id,
              columnName: 'plate number',
              from: old.plateNumber,
              to: updated.plateNumber,
            },
          }),
        old.photoUrl !== updated.photoUrl &&
          tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: AuditAction.Modification,
              affectedTable: AuditAffectedTable.Vehicle,
              affectedRowId: updated.id,
              columnName: 'image',
              from: old.photoUrl,
              to: updated.photoUrl,
            },
          }),
        old.serviceFeePerHour &&
          +old.serviceFeePerHour !== updated.serviceFeePerHour &&
          tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: AuditAction.Modification,
              affectedTable: AuditAffectedTable.Vehicle,
              affectedRowId: updated.id,
              columnName: 'service Fee Per Hour',
              from: old.serviceFeePerHour.toString(),
              to: updated.serviceFeePerHour.toString(),
            },
          }),
        old.purchaseDate.toISOString() !== updated.purchaseDate.toISOString() &&
          tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: AuditAction.Modification,
              affectedTable: AuditAffectedTable.Vehicle,
              affectedRowId: updated.id,
              columnName: 'purchase date',
              from: old.purchaseDate.toString(),
              to: format(updated.purchaseDate, 'yyyy-MM-dd'),
            },
          }),
        old.lastMaintenance?.toISOString() !==
          updated.lastMaintenance?.toISOString() &&
          tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: AuditAction.Modification,
              affectedTable: AuditAffectedTable.Vehicle,
              affectedRowId: updated.id,
              columnName: 'last maintenance',
              from: old.lastMaintenance?.toString(),
              to:
                updated.lastMaintenance &&
                format(updated.lastMaintenance, 'yyyy-MM-dd'),
            },
          }),
        old.status !== updated.status &&
          tx.auditLog.create({
            data: {
              actorId: session.user.id,
              action: AuditAction.Modification,
              affectedTable: AuditAffectedTable.Vehicle,
              affectedRowId: updated.id,
              columnName: 'status',
              from: VehicleStatusLabel[old.status as VehicleStatus],
              to: VehicleStatusLabel[updated.status as VehicleStatus],
            },
          }),
      ])

      return { status: 201 }
    })
  } catch (error) {
    console.error(error)
    return { status: 500 }
  }
}
