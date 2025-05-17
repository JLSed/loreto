'use server'

import { prisma } from '@/common/configs/prisma'

export async function getInquiries() {
  return await prisma.apartmentInquiry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: { apartment: true },
  })
}

export async function updateInquiryStatus(
  status: number,
  inquiryId: number,
  remarks: string
) {
  return await prisma.apartmentInquiry.update({
    where: {
      id: inquiryId,
    },
    data: {
      status,
      remarks,
    },
  })
}
