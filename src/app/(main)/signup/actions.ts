'use server'

import { prisma } from '@/common/configs/prisma'
import { NewUser } from './new-user-schema'
import { hashPassword } from '@/lib/server-only-utils'

export async function createUser(input: NewUser, username: string) {
  return await prisma.$transaction(async (tx) => {
    const userExist = await tx.user.findFirst({
      where: {
        email: input.email,
      },
    })

    if (userExist) return { status: 409 }

    const newUserEntry = await tx.user.create({
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        username,
        password: hashPassword(input.password),
      },
    })

    return { status: 201, id: newUserEntry.id }
  })
}
