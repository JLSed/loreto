'use server'

import { prisma } from '@/common/configs/prisma'
import { NewApartment } from './new-apartment-schema'

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
