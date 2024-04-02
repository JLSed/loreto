'use server'

import { authOptions } from '@/common/configs/auth'
import { prisma } from '@/common/configs/prisma'
import { UserRoleLabel } from '@/common/constants/business'
import {
  AuditAction,
  AuditAffectedTable,
  UserRole,
} from '@/common/enums/enums.db'
import { getServerSession } from 'next-auth'

export async function updateRole(userId: string, newRole: UserRole) {
  try {
    return await prisma.$transaction(async (tx) => {
      const session = await getServerSession(authOptions)
      const actor = session?.user

      if (!actor) {
        return { status: 401 }
      }

      if (actor.role !== UserRole.Admin) {
        return { status: 403 }
      }

      const old = await tx.user.findUnique({
        where: { id: userId },
      })

      if (!old) {
        return { status: 404 }
      }

      if (old.role === newRole) {
        return { status: 200 }
      }

      const updated = await tx.user.update({
        where: { id: userId },
        data: { role: newRole },
      })

      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          affectedRowId: userId,
          affectedTable: AuditAffectedTable.User,
          action: AuditAction.Modification,
          columnName: 'role',
          from: UserRoleLabel[old.role as UserRole],
          to: UserRoleLabel[updated.role as UserRole],
        },
      })

      return { status: 200 }
    })
  } catch (error) {
    console.log(error)
    return { status: 500 }
  }
}
