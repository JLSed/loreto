'use server'

import { prisma } from '@/common/configs/prisma'
import { authOptions } from '@/common/configs/auth'
import { cloud } from '@/common/configs/cloud'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import jsPDF from 'jspdf'

// Helper function to convert image URL to base64
async function getImageAsBase64(imageUrl: string): Promise<string | null> {
  try {
    if (imageUrl.startsWith('data:')) {
      return imageUrl // Already base64
    }

    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    // Determine the MIME type from the response headers or URL
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    return `data:${contentType};base64,${base64}`
  } catch (error) {
    console.error('Error converting image to base64:', error)
    return null
  }
}

interface TenantSignatureData {
  tenantId: number
  tenantName: string
  tenantContact: string
  tenantSignature: string
}

interface AdminSignatureData {
  tenantId: number
  landlordName: string
  landlordContact: string
  ownerSignature: string
}

export async function signRentalAgreement(data: TenantSignatureData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, message: 'Unauthorized' }
    }

    // Validate contact number
    if (!/^[0-9]{11}$/.test(data.tenantContact)) {
      return {
        success: false,
        message: 'Contact number must be exactly 11 digits',
      }
    }

    // Verify that the tenant exists and belongs to the current user
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        id: data.tenantId,
        emailAddress: session.user.email,
      },
    })

    if (!existingTenant) {
      return { success: false, message: 'Tenant not found or access denied' }
    }

    // Check if tenant has already signed
    if ((existingTenant as any).tenantSigned) {
      return { success: false, message: 'Agreement already signed by tenant' }
    }

    let tenantSignatureUrl = data.tenantSignature

    // Upload signature to Cloudinary if it's a data URL
    if (data.tenantSignature && data.tenantSignature.startsWith('data:')) {
      const uploadResponse = await cloud.uploader.upload(data.tenantSignature, {
        public_id: `tenant-signature-tenant-${data.tenantId}`,
        overwrite: true,
        folder: 'loreto/signatures',
      })
      tenantSignatureUrl = uploadResponse.secure_url
    }

    // Update the tenant record with signature information
    const updatedTenant = await prisma.tenant.update({
      where: {
        id: data.tenantId,
      },
      data: {
        firstName: data.tenantName.split(' ')[0],
        lastName: data.tenantName.split(' ').slice(1).join(' ') || '',
        contactNumber: data.tenantContact,
        tenantSignature: tenantSignatureUrl,
        tenantSigned: true,
        tenantSignedAt: new Date(),
      } as any,
    })

    revalidatePath(`/me/rent`)
    revalidatePath(`/dashboard/tenants/${data.tenantId}`)

    return { success: true, message: 'Agreement signed successfully by tenant' }
  } catch (error) {
    console.error('Error signing rental agreement:', error)
    return { success: false, message: 'Failed to sign rental agreement' }
  }
}

export async function signRentalAgreementAsAdmin(data: AdminSignatureData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user as any).role > 2) {
      return { success: false, message: 'Unauthorized - Admin access required' }
    }

    // Validate contact number
    if (!/^[0-9]{11}$/.test(data.landlordContact)) {
      return {
        success: false,
        message: 'Contact number must be exactly 11 digits',
      }
    }

    // Verify that the tenant exists
    const existingTenant = await prisma.tenant.findUnique({
      where: { id: data.tenantId },
    })

    if (!existingTenant) {
      return { success: false, message: 'Tenant not found' }
    }

    // Check if admin has already signed
    if ((existingTenant as any).adminSigned) {
      return { success: false, message: 'Agreement already signed by admin' }
    }

    let ownerSignatureUrl = data.ownerSignature

    // Upload signature to Cloudinary if it's a data URL
    if (data.ownerSignature && data.ownerSignature.startsWith('data:')) {
      const uploadResponse = await cloud.uploader.upload(data.ownerSignature, {
        public_id: `owner-signature-tenant-${data.tenantId}`,
        overwrite: true,
        folder: 'loreto/signatures',
      })
      ownerSignatureUrl = uploadResponse.secure_url
    }

    // Update the tenant record with admin signature information
    const updatedTenant = await prisma.tenant.update({
      where: {
        id: data.tenantId,
      },
      data: {
        ownerName: data.landlordName,
        ownerContact: data.landlordContact,
        ownerSignature: ownerSignatureUrl,
        adminSigned: true,
        adminSignedAt: new Date(),
        // Set contract as fully signed if both parties have signed
        contractSigned: (existingTenant as any).tenantSigned
          ? new Date()
          : existingTenant.contractSigned,
        agreementCreated: existingTenant.agreementCreated || new Date(),
      } as any,
    })

    revalidatePath(`/me/rent`)
    revalidatePath(`/dashboard/tenants/${data.tenantId}`)

    return { success: true, message: 'Agreement signed successfully by admin' }
  } catch (error) {
    console.error('Error signing rental agreement as admin:', error)
    return { success: false, message: 'Failed to sign rental agreement' }
  }
}

export async function exportRentalAgreementToPDF(tenantId: number) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return { success: false, message: 'Unauthorized' }
    }

    // Get tenant details with apartment information
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: tenantId,
        OR: [
          { emailAddress: session.user.email }, // Tenant can access their own
          { id: tenantId }, // Admin/staff can access any (role check below)
        ],
      },
      include: {
        Apartment: true,
      },
    })

    if (!tenant) {
      return { success: false, message: 'Tenant not found or access denied' }
    }

    // Check if user has access (tenant accessing own or admin/staff)
    const isOwnTenant = tenant.emailAddress === session.user.email
    const isAdmin = (session.user as any).role <= 2

    if (!isOwnTenant && !isAdmin) {
      return { success: false, message: 'Access denied' }
    }

    // Check if agreement is fully signed
    if (!(tenant as any).tenantSigned || !(tenant as any).adminSigned) {
      return {
        success: false,
        message: 'Agreement must be fully signed before exporting',
      }
    }

    const apartment = tenant.Apartment[0] // Assuming one apartment per tenant

    // Create PDF
    const doc = new jsPDF()

    // Title
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('ROOM RENTAL AGREEMENT', 105, 25, { align: 'center' })

    // Agreement date
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const agreementDate = tenant.agreementCreated
      ? new Date(tenant.agreementCreated).toLocaleDateString()
      : 'N/A'
    doc.text(
      `This agreement is made on ${agreementDate}, between the following parties:`,
      20,
      40
    )

    // Landlord info
    doc.setFont('helvetica', 'bold')
    doc.text('LANDLORD:', 20, 50)
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${tenant.ownerName || 'N/A'}`, 20, 63)
    doc.text(`Contact: ${tenant.ownerContact || 'N/A'}`, 20, 73)

    // Tenant info
    doc.setFont('helvetica', 'bold')
    doc.text('TENANT:', 20, 86)
    doc.setFont('helvetica', 'normal')
    doc.text(`Name: ${tenant.firstName} ${tenant.lastName}`, 20, 99)
    doc.text(`Contact: ${tenant.contactNumber}`, 20, 109)

    // Property details
    if (apartment) {
      doc.text('The Landlord agrees to rent a room located at:', 20, 120)
      doc.setFont('helvetica', 'bold')
      doc.text(` ${apartment.address}`, 25, 125)
      doc.setFont('helvetica', 'normal')
      doc.text(
        `Monthly Rent: ${apartment.monthlyRentalPrice.toLocaleString()} Pesos`,
        25,
        135
      )
      doc.text(
        `Payment Date: Every ${tenant.monthlyDueDate} of the month`,
        25,
        145
      )
      doc.text(
        `Advance Deposit: Two (2) months equivalent to ${(
          apartment.monthlyRentalPrice * 2
        ).toLocaleString()} Pesos`,
        25,
        155
      )
    }

    // Terms
    doc.text('Terms and Conditions:', 20, 170)
    doc.setFontSize(12)
    const terms =
      "The room shall be used for residential purposes only by the tenant and their family. Both parties agree to maintain cleanliness, avoid disturbances, and respect each other's rights. Either party may end this agreement with a 30-day notice. Any damages caused by the tenant shall be subject to deduction from the deposit."
    const splitTerms = doc.splitTextToSize(terms, 170)
    doc.text(splitTerms, 20, 180)

    // Signatures
    doc.setFontSize(12)
    const contractDate = tenant.contractSigned
      ? new Date(tenant.contractSigned).toLocaleDateString()
      : 'N/A'
    doc.text(`Signed on: ${contractDate}`, 20, 210)

    // Signature placeholders
    doc.setFont('helvetica', 'bold')
    doc.text('LANDLORD:', 30, 220)
    doc.text('TENANT:', 120, 220)

    // Add signature images if available
    let landlordSignatureAdded = false
    let tenantSignatureAdded = false

    if (tenant.ownerSignature) {
      try {
        const imageData = await getImageAsBase64(tenant.ownerSignature)
        if (imageData) {
          doc.addImage(imageData, 'JPEG', 32, 225, 56, 26)
          landlordSignatureAdded = true
        }
      } catch (error) {
        console.warn('Failed to add landlord signature image:', error)
      }
    }

    doc.setFont('helvetica', 'normal')
    doc.text('_____________________', 30, 255)
    if (tenant.tenantSignature) {
      try {
        const imageData = await getImageAsBase64(tenant.tenantSignature)
        if (imageData) {
          doc.addImage(imageData, 'JPEG', 122, 225, 56, 26)
          tenantSignatureAdded = true
        }
      } catch (error) {
        console.warn('Failed to add tenant signature image:', error)
      }
    }

    doc.setFont('helvetica', 'normal')
    doc.text('_____________________', 120, 255)

    // Add names below signatures
    doc.setFont('helvetica', 'normal')
    doc.text(`${tenant.ownerName || 'N/A'}`, 30, 255)
    doc.text(`${tenant.firstName} ${tenant.lastName}`, 120, 255)

    // Add signature dates
    if ((tenant as any).adminSignedAt) {
      doc.text(
        `Signed: ${new Date(
          (tenant as any).adminSignedAt
        ).toLocaleDateString()}`,
        30,
        265
      )
    }
    if ((tenant as any).tenantSignedAt) {
      doc.text(
        `Signed: ${new Date(
          (tenant as any).tenantSignedAt
        ).toLocaleDateString()}`,
        120,
        265
      )
    }

    // Convert to base64
    const pdfData = doc.output('datauristring').split(',')[1]

    return {
      success: true,
      pdfData,
      message: 'PDF generated successfully',
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
    return { success: false, message: 'Failed to generate PDF' }
  }
}
