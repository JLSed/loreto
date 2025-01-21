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
  | 'quality'
> & {
  markings: Omit<LocalMarking, 'id'>[]
  imageMarkings: Omit<LocalImageMarking, 'id'>[]
}

export const saveBoxAction = async (params: SaveBoxParams) => {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user
    if (!user) {
      return { status: 401, error: 'Unauthorized' }
    }

    return await prisma.$transaction(async (tx) => {
      const nameExistWithUser = await tx.box.findFirst({
        where: {
          name: params.name,
          ownerId: user.id,
        },
      })
      if (nameExistWithUser) {
        return { status: 409, error: 'Box with this name already exists.' }
      }

      const box = await tx.box.create({
        data: {
          name: params.name,
          totalWidth: params.totalWidth,
          height: params.height,
          leftPanelSize: params.leftPanelSize,
          rightPanelSize: params.rightPanelSize,
          dragTransform: params.dragTransform,
          thickness: params.thickness,
          quality: params.quality,
          owner: {
            connect: {
              id: user.id,
            },
          },
        },
      })

      await Promise.all([
        tx.boxMarking.createMany({
          data: params.markings.map((marking) => ({
            boxId: box.id,
            cssTransform: marking.transform,
            label: marking.label,
            value: marking.value,
          })),
        }),
        tx.imageMarking.createMany({
          data: params.imageMarkings.map((marking) => ({
            boxId: box.id,
            src: marking.imageSrc,
            height: marking.height,
            width: marking.width,
            transform: marking.transform,
          })),
        }),
      ])

      return { status: 200 }
    })
  } catch (error) {
    console.log(
      'Error occured in saveBoxAction: src/app/(main)/box/actions.tsx',
      error
    )
    return { status: 500, error: 'Something went wrong. Please try again.' }
  }
}
