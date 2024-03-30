'use server'

import { cloud } from '@/common/configs/cloud'
import { NewVehicleInput } from './page'
import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/configs/auth'
import { AuditAction, AuditAffectedTable } from '@/common/enums/enums.db'

export async function createNewVehicle({ photo, ...data }: NewVehicleInput) {
  let uploadedId
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { status: 401 }
    }

    const uploadResponse = await cloud.uploader.upload(photo, {
      public_id: `vehicle-${data.name}`,
      overwrite: true,
      filename_override: `vehicle-${data.name}`,
      folder: 'loreto',
    })
    uploadedId = uploadResponse.public_id

    const entry = await prisma.vehicle.create({
      data: {
        ...data,
        photoUrl: uploadResponse.secure_url,
        purchaseDate: new Date(data.purchaseDate).toISOString(),
        lastMaintenance: data.lastMaintenance
          ? new Date(data.lastMaintenance).toISOString()
          : undefined,
      },
    })

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: AuditAction.Creation,
        affectedTable: AuditAffectedTable.Vehicles,
        affectedRowId: entry.id,
      },
    })

    return { status: 200 }
  } catch (error) {
    console.log(error)

    uploadedId &&
      cloud.api
        .delete_resources([uploadedId], {
          type: 'upload',
          resource_type: 'image',
        })
        .then(console.log)
    return { status: 500 }
  }
}
