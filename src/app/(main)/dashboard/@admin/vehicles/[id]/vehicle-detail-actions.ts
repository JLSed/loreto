'use server'

import { cloud } from "@/common/configs/cloud";
import { UpdateVehicleInput } from "./VehicleDetails";
import { prisma } from "@/common/configs/prisma";

export async function updateVehicleAction(data: UpdateVehicleInput) {
  try {
    let photoUrl: string | undefined;

    if (data.newPhotoUrl) {
      const cloudResponse = await cloud.uploader.upload(data.newPhotoUrl, {
        public_id: `vehicle-${data.name}`,
        overwrite: true,
        filename_override: `vehicle-${data.name}`,
        folder: 'loreto',
      })
      photoUrl = cloudResponse.secure_url
    }

    delete data.newPhotoUrl

    await prisma.vehicle.update({
      where: { id: data.id },
      data: {
        ...data,
        photoUrl: photoUrl ? photoUrl : data.photoUrl,
        serviceFeePerHour: data.serviceFeePerHour ? parseFloat(data.serviceFeePerHour) : undefined,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        lastMaintenance: data.lastMaintenance ? new Date(data.lastMaintenance) : undefined,
      },
    })

    return { status: 201 }
  }
  catch (error) {
    console.error(error)
    return { status: 500 }
  }
}
