'use server'

import { prisma } from '@/common/configs/prisma'
import { notFound } from 'next/navigation'

export async function getBookingById(id: string) {
  const data = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      booker: true,
    },
  })

  if (!data) {
    notFound()
  }

  return data
}

export async function updateBookingStatus(id: string, status: number) {
  try {
    await prisma.booking.update({
      where: { id },
      data: { status },
    })
    return { status: 201 }
  } catch (error) {
    return { status: 500 }
  }
}
