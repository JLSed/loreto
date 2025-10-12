'use server'

import { prisma } from '@/common/configs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/common/configs/auth'
import { AuditAction, AuditAffectedTable } from '@/common/enums/enums.db'
import { revalidatePath } from 'next/cache'

// BoxInventory Actions
export async function createBoxInventoryEntry(data: {
  length: number
  width: number
  height: number
  thickness: number
  color: number
  quantity: number
  weightPerPiece: number
  cardboardType: number
  boxType: number
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const totalWeight = data.quantity * data.weightPerPiece

    const entry = await prisma.boxInventory.create({
      data: {
        ...data,
        TotalWeight: totalWeight,
      },
      include: {
        type: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: AuditAction.Creation,
        affectedTable: AuditAffectedTable.BoxInventory,
        affectedRowId: entry.id,
        remark: `Created box inventory entry: ${data.length}x${data.width}x${data.height} (Qty: ${data.quantity})`,
        actorId: session.user.id,
      },
    })

    revalidatePath('/dashboard/inventory')
    return { success: true, data: entry }
  } catch (error) {
    console.error('Error creating box inventory entry:', error)
    return { success: false, error: 'Failed to create box inventory entry' }
  }
}

export async function updateBoxInventoryEntry(
  id: string,
  data: {
    quantity: number
    weightPerPiece: number
  }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const totalWeight = data.quantity * data.weightPerPiece

    const entry = await prisma.boxInventory.update({
      where: { id },
      data: {
        quantity: data.quantity,
        weightPerPiece: data.weightPerPiece,
        TotalWeight: totalWeight,
      },
      include: {
        type: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: AuditAction.Modification,
        affectedTable: AuditAffectedTable.BoxInventory,
        affectedRowId: id,
        remark: `Updated box inventory entry quantity to ${data.quantity}`,
        actorId: session.user.id,
      },
    })

    revalidatePath('/dashboard/inventory')
    return { success: true, data: entry }
  } catch (error) {
    console.error('Error updating box inventory entry:', error)
    return { success: false, error: 'Failed to update box inventory entry' }
  }
}

export async function deleteBoxInventoryEntry(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    await prisma.boxInventory.delete({
      where: { id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: AuditAction.Deletion,
        affectedTable: AuditAffectedTable.BoxInventory,
        affectedRowId: id,
        remark: 'Deleted box inventory entry',
        actorId: session.user.id,
      },
    })

    revalidatePath('/dashboard/inventory')
    return { success: true }
  } catch (error) {
    console.error('Error deleting box inventory entry:', error)
    return { success: false, error: 'Failed to delete box inventory entry' }
  }
}

// BoxType Actions
export async function createBoxType(typeName: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const boxType = await prisma.boxType.create({
      data: { typeName },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: AuditAction.Creation,
        affectedTable: AuditAffectedTable.BoxType,
        affectedRowId: boxType.id.toString(),
        remark: `Created box type: ${typeName}`,
        actorId: session.user.id,
      },
    })

    revalidatePath('/dashboard/inventory')
    return { success: true, data: boxType }
  } catch (error) {
    console.error('Error creating box type:', error)
    return { success: false, error: 'Failed to create box type' }
  }
}

export async function deleteBoxType(id: number) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    // Check if box type is in use
    const inUse = await prisma.boxInventory.findFirst({
      where: { boxType: id },
    })

    if (inUse) {
      return { success: false, error: 'Cannot delete box type that is in use' }
    }

    await prisma.boxType.delete({
      where: { id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: AuditAction.Deletion,
        affectedTable: AuditAffectedTable.BoxType,
        affectedRowId: id.toString(),
        remark: 'Deleted box type',
        actorId: session.user.id,
      },
    })

    revalidatePath('/dashboard/inventory')
    return { success: true }
  } catch (error) {
    console.error('Error deleting box type:', error)
    return { success: false, error: 'Failed to delete box type' }
  }
}

// Data fetching functions
export async function getBoxInventory() {
  try {
    return await prisma.boxInventory.findMany({
      include: {
        type: true,
      },
      orderBy: {
        id: 'desc',
      },
    })
  } catch (error) {
    console.error('Error fetching box inventory:', error)
    return []
  }
}

export async function getBoxTypes() {
  try {
    return await prisma.boxType.findMany({
      orderBy: {
        typeName: 'asc',
      },
    })
  } catch (error) {
    console.error('Error fetching box types:', error)
    return []
  }
}

export async function getInventoryDashboardData() {
  try {
    const inventory = await prisma.boxInventory.findMany({
      include: {
        type: true,
      },
    })

    // Group by box type and calculate totals
    const dashboardData = inventory.reduce((acc, item) => {
      const typeName = item.type.typeName
      if (!acc[typeName]) {
        acc[typeName] = {
          typeName,
          totalQuantity: 0,
          totalWeight: 0,
          entries: 0,
        }
      }
      acc[typeName].totalQuantity += item.quantity
      acc[typeName].totalWeight += item.TotalWeight
      acc[typeName].entries += 1
      return acc
    }, {} as Record<string, { typeName: string; totalQuantity: number; totalWeight: number; entries: number }>)

    return Object.values(dashboardData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return []
  }
}

// CSV Export/Import functions
export async function exportInventoryToCSV() {
  try {
    const inventory = await getBoxInventory()
    return inventory.map((item) => ({
      id: item.id,
      length: item.length,
      width: item.width,
      height: item.height,
      thickness: item.thickness === 0 ? 'Single' : 'Double',
      color: item.color === 0 ? 'White' : 'Yellow',
      quantity: item.quantity,
      weightPerPiece: item.weightPerPiece,
      totalWeight: item.TotalWeight,
      cardboardType: item.cardboardType === 0 ? 'Brand New' : 'Second Hand',
      boxType: item.type.typeName,
    }))
  } catch (error) {
    console.error('Error exporting inventory:', error)
    return []
  }
}

export async function importInventoryFromCSV(
  csvData: Array<{
    length: number
    width: number
    height: number
    thickness: string
    color: string
    quantity: number
    weightPerPiece: number
    cardboardType: string
    boxType: string
  }>
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user.id) {
      return { success: false, error: 'Unauthorized' }
    }

    const results = []

    for (const row of csvData) {
      try {
        // Find or create box type
        let boxType = await prisma.boxType.findFirst({
          where: { typeName: row.boxType },
        })

        if (!boxType) {
          boxType = await prisma.boxType.create({
            data: { typeName: row.boxType },
          })
        }

        // Create box inventory entry
        const entry = await createBoxInventoryEntry({
          length: row.length,
          width: row.width,
          height: row.height,
          thickness: row.thickness.toLowerCase() === 'double' ? 1 : 0,
          color: row.color.toLowerCase() === 'yellow' ? 1 : 0,
          quantity: row.quantity,
          weightPerPiece: row.weightPerPiece,
          cardboardType: row.cardboardType.toLowerCase().includes('second')
            ? 1
            : 0,
          boxType: boxType.id,
        })

        results.push({ success: true, data: entry })
      } catch (rowError) {
        results.push({
          success: false,
          error: `Failed to import row: ${JSON.stringify(row)}`,
        })
      }
    }

    revalidatePath('/dashboard/inventory')
    return { success: true, results }
  } catch (error) {
    console.error('Error importing CSV:', error)
    return { success: false, error: 'Failed to import CSV data' }
  }
}
