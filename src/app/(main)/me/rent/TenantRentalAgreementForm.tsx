'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ImageUpload from '@/components/shared/ImageUpload'
import { Tenant, Apartment } from '@prisma/client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, FileDown, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import {
  signRentalAgreement,
  exportRentalAgreementToPDF,
} from './tenant-agreement-actions'
import { Badge } from '@/components/ui/badge'

interface TenantAgreementData {
  tenantName: string
  tenantContact: string
}

interface SignatureUpload {
  imageSrc?: string
  file?: File
}

interface Props {
  tenant: Tenant & {
    apartment?: Apartment
    tenantSigned?: boolean
    adminSigned?: boolean
    tenantSignedAt?: Date
    adminSignedAt?: Date
  }
}

export default function TenantRentalAgreementForm({ tenant }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [tenantSignatureFile, setTenantSignatureFile] =
    useState<SignatureUpload>({
      imageSrc: (tenant as any).tenantSignature || '',
    })

  const form = useForm<TenantAgreementData>({
    defaultValues: {
      tenantName: `${tenant.firstName} ${tenant.lastName}`,
      tenantContact: tenant.contactNumber,
    },
  })

  const handleSign = async (data: TenantAgreementData) => {
    if (!tenantSignatureFile.imageSrc) {
      toast.error('Please upload your signature first')
      return
    }

    setIsLoading(true)
    try {
      const result = await signRentalAgreement({
        tenantId: tenant.id,
        tenantName: data.tenantName,
        tenantContact: data.tenantContact,
        tenantSignature: tenantSignatureFile.imageSrc,
      })

      if (result.success) {
        toast.success('Agreement signed successfully!')
        window.location.reload()
      } else {
        toast.error(result.message || 'Failed to sign agreement')
      }
    } catch (error) {
      toast.error('An error occurred while signing the agreement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const result = await exportRentalAgreementToPDF(tenant.id)
      if (result.success) {
        // Create blob and download
        const binaryString = atob(result.pdfData)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        const blob = new Blob([bytes], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rental-agreement-${tenant.firstName}-${tenant.lastName}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('PDF exported successfully!')
      } else {
        toast.error(result.message || 'Failed to export PDF')
      }
    } catch (error) {
      toast.error('An error occurred while exporting PDF')
    } finally {
      setIsExporting(false)
    }
  }

  const isAgreementComplete = tenant.tenantSigned && tenant.adminSigned
  const canTenantSign = !tenant.tenantSigned

  return (
    <div className='space-y-6'>
      {/* Agreement Status */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            Rental Agreement Status
            {isAgreementComplete && (
              <Badge
                variant='default'
                className='bg-green-600'
              >
                <CheckCircle className='w-4 h-4 mr-1' />
                Fully Signed
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              {tenant.tenantSigned ? (
                <>
                  <CheckCircle className='w-5 h-5 text-green-600' />
                  <span>Tenant Signed</span>
                  {tenant.tenantSignedAt && (
                    <span className='text-sm text-muted-foreground'>
                      ({new Date(tenant.tenantSignedAt).toLocaleDateString()})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Clock className='w-5 h-5 text-yellow-600' />
                  <span>Pending Tenant Signature</span>
                </>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {tenant.adminSigned ? (
                <>
                  <CheckCircle className='w-5 h-5 text-green-600' />
                  <span>Landlord Signed</span>
                  {tenant.adminSignedAt && (
                    <span className='text-sm text-muted-foreground'>
                      ({new Date(tenant.adminSignedAt).toLocaleDateString()})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Clock className='w-5 h-5 text-yellow-600' />
                  <span>Pending Admin Signature</span>
                </>
              )}
            </div>
          </div>

          {isAgreementComplete && (
            <div className='mt-4 pt-4 border-t'>
              <Button
                onClick={handleExportPDF}
                disabled={isExporting}
                variant='outline'
                className='w-full md:w-auto'
              >
                {isExporting && (
                  <Loader2 className='w-4 h-4 animate-spin mr-2' />
                )}
                <FileDown className='w-4 h-4 mr-2' />
                Export as PDF
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tenant Signature Form */}
      {canTenantSign && (
        <Card>
          <CardHeader>
            <CardTitle>Sign Rental Agreement</CardTitle>
            <p className='text-sm text-muted-foreground'>
              Please review your information and provide your signature to
              complete your portion of the rental agreement.
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSign)}
              className='space-y-6'
            >
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Full Name *
                  </label>
                  <Input
                    {...form.register('tenantName', {
                      required: 'Name is required',
                    })}
                    placeholder='Your full name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Contact Number *
                  </label>
                  <Input
                    {...form.register('tenantContact', {
                      required: 'Contact number is required',
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: 'Contact number must be exactly 11 digits',
                      },
                    })}
                    maxLength={11}
                    inputMode='numeric'
                    placeholder='09XXXXXXXXX'
                    title='Contact number must be exactly 11 digits'
                  />
                  {form.formState.errors.tenantContact && (
                    <p className='text-xs text-red-600 mt-1'>
                      {form.formState.errors.tenantContact.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium mb-2'>
                  Digital Signature *
                </label>
                <p className='text-xs text-muted-foreground mb-2'>
                  Please upload an image of your signature (PNG, JPG, or JPEG
                  format)
                </p>
                <ImageUpload
                  initialImageSrc={tenantSignatureFile.imageSrc || ''}
                  onImageChange={(params) => {
                    setTenantSignatureFile(params)
                  }}
                  inputName='tenantSignature'
                />
              </div>

              <div className='flex justify-end'>
                <Button
                  type='submit'
                  disabled={isLoading || !tenantSignatureFile.imageSrc}
                  className='min-w-[120px]'
                >
                  {isLoading && (
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                  )}
                  Sign Agreement
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Read-only Agreement Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Agreement Preview</CardTitle>
        </CardHeader>
        <CardContent id='agreement-preview'>
          <div className='prose max-w-none space-y-4'>
            <p>
              This agreement is made on this{' '}
              {(tenant as any).agreementCreated
                ? new Date(
                    (tenant as any).agreementCreated
                  ).toLocaleDateString()
                : 'TBD'}
              , between the following parties:
            </p>

            <div>
              <h4 className='font-semibold'>LANDLORD:</h4>
              <p>Name: {(tenant as any).ownerName || 'TBD'}</p>
              <p>Contact: {(tenant as any).ownerContact || 'TBD'}</p>
            </div>

            <div>
              <h4 className='font-semibold'>TENANT:</h4>
              <p>Name: {form.watch('tenantName')}</p>
              <p>Contact: {form.watch('tenantContact')}</p>
            </div>

            {tenant.apartment && (
              <div>
                <p>The Landlord agrees to rent a room located at:</p>
                <div className='ml-4'>
                  <p>Address: {tenant.apartment.address}</p>
                  <p>
                    Monthly Rent: ₱
                    {tenant.apartment.monthlyRentalPrice.toLocaleString()}
                  </p>
                  <p>
                    Payment Date: Every {tenant.monthlyDueDate} of the month
                  </p>
                  <p>
                    Advance Deposit: Two (2) months equivalent to ₱
                    {(tenant.apartment.monthlyRentalPrice * 2).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            <p className='text-sm text-muted-foreground'>
              The room shall be used for residential purposes only by the tenant
              and their family. Both parties agree to maintain cleanliness,
              avoid disturbances, and respect each other&apos;s rights. Either
              party may end this agreement with a 30-day notice. Any damages
              caused by the tenant shall be subject to deduction from the
              deposit.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
