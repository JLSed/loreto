'use server'

import { Box } from '@prisma/client'
import { LocalImageMarking, LocalMarking } from './useBoxControls'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'

type SaveBoxParams = Pick<
  Box,
  | 'name'
  | 'totalWidth'
  | 'height'
  | 'leftPanelSize'
  | 'rightPanelSize'
  | 'dragTransform'
  | 'thickness'
  | 'placement'
> & {
  markings: Omit<LocalMarking, 'id'>[]
  imageMarkings: Omit<LocalImageMarking, 'id'>[]
}

export const saveBoxAction = async (params: SaveBoxParams) => {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!user) {
      return { status: 401 }
    }

    return await prisma.$transaction(async (tx) => {
      const box = await tx.box.create({
        data: {
          name: params.name,
          totalWidth: params.totalWidth,
          height: params.height,
          leftPanelSize: params.leftPanelSize,
          rightPanelSize: params.rightPanelSize,
          dragTransform: params.dragTransform,
          thickness: params.thickness,
          placement: params.placement,
          ownerId: user.id,
        },
      })

      await tx.boxMarking.createMany({
        data: params.markings.map((marking) => ({
          boxId: box.id,
          cssTransform: marking.transform,
          label: marking.label,
          value: marking.value,
        })),
      })

      await tx.imageMarking.createMany({
        data: params.imageMarkings.map((marking) => ({
          boxId: box.id,
          src: marking.imageSrc,
          height: marking.height,
          width: marking.width,
          transform: marking.transform,
        })),
      })

      return { status: 200 }
    })
  } catch (error) {
    console.log(error)
    return { status: 500 }
  }
}
