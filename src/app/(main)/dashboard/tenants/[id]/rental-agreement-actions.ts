'use server'

import { prisma } from '@/common/configs/prisma'
import { authOptions } from '@/common/configs/auth'
import { cloud } from '@/common/configs/cloud'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'

interface RentalAgreementData {
  agreementDate: Date
  landlordName: string
  landlordContact: string
  contractSignedDate: Date
  ownerSignature: string
  tenantSignature: string
  witnesses: string[]
  tenantId: number
}

export async function saveRentalAgreement(data: RentalAgreementData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, message: 'Unauthorized' }
    }

    // Verify that the tenant exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId },
    })

    if (!existingTenant) {
      return { success: false, message: 'Tenant not found' }
    }

    let ownerSignatureUrl = data.ownerSignature
    let tenantSignatureUrl = data.tenantSignature

    if (data.ownerSignature && data.ownerSignature.startsWith('data:')) {
      const uploadResponse = await cloud.uploader.upload(data.ownerSignature, {
        public_id: `owner-signature-tenant-${data.tenantId}`,
        overwrite: true,
        folder: 'loreto/signatures',
      })
      ownerSignatureUrl = uploadResponse.secure_url
    }

    if (data.tenantSignature && data.tenantSignature.startsWith('data:')) {
      const uploadResponse = await cloud.uploader.upload(data.tenantSignature, {
        public_id: `tenant-signature-tenant-${data.tenantId}`,
        overwrite: true,
        folder: 'loreto/signatures',
      })
      tenantSignatureUrl = uploadResponse.secure_url
    }

    // Update the tenant record with the rental agreement information
    // Note: Using type assertion since IDE might not have picked up the updated Prisma types yet
    const updatedTenant = await prisma.tenant.update({
      where: {
        id: data.tenantId,
      },
      data: {
        ownerName: data.landlordName,
        ownerContact: data.landlordContact,
        ownerSignature: ownerSignatureUrl,
        tenantSignature: tenantSignatureUrl,
        witnesses: data.witnesses,
        contractSigned: data.contractSignedDate,
        agreementCreated: data.agreementDate,
      } as any,
    })

    console.log(
      'Rental agreement successfully saved to database for tenant:',
      updatedTenant.id
    )

    revalidatePath(`/dashboard/tenants/${data.tenantId}`)

    return { success: true, message: 'Rental agreement saved successfully' }
  } catch (error) {
    console.error('Error saving rental agreement:', error)
    return { success: false, message: 'Failed to save rental agreement' }
  }
}

export async function getRentalAgreement(tenantId: number) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        ownerName: true,
        ownerContact: true,
        ownerSignature: true,
        tenantSignature: true,
        witnesses: true,
        contractSigned: true,
        agreementCreated: true,
      } as any,
    })

    return tenant
  } catch (error) {
    console.error('Error retrieving rental agreement:', error)
    return null
  }
}
