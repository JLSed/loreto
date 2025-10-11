'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/shared/DatePicker'
import ImageUpload from '@/components/shared/ImageUpload'
import { Apartment, Tenant } from '@prisma/client'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { saveRentalAgreement } from './rental-agreement-actions'

interface RentalAgreementData {
  agreementDate: Date
  landlordName: string
  landlordContact: string
  contractSignedDate: Date
  ownerSignature: string
  tenantSignature: string
  witnesses: string[]
}

interface SignatureUpload {
  imageSrc?: string
  file?: File
}

interface Props {
  tenant: Tenant
  apartment: Apartment | null
}

export default function RentalAgreementForm({ tenant, apartment }: Props) {
  // Helper function to safely access tenant fields that might not be in the type
  const getTenantField = (field: string) => (tenant as any)[field]
  const [isLoading, setIsLoading] = useState(false)
  const [witnesses, setWitnesses] = useState<string[]>(
    getTenantField('witnesses') && getTenantField('witnesses').length > 0
      ? getTenantField('witnesses')
      : ['', '']
  )
  const [ownerSignatureFile, setOwnerSignatureFile] = useState<SignatureUpload>(
    {
      imageSrc: getTenantField('ownerSignature') || '',
    }
  )
  const [tenantSignatureFile, setTenantSignatureFile] =
    useState<SignatureUpload>({
      imageSrc: getTenantField('tenantSignature') || '',
    })

  const form = useForm<RentalAgreementData>({
    defaultValues: {
      agreementDate: getTenantField('agreementCreated')
        ? new Date(getTenantField('agreementCreated'))
        : new Date(),
      landlordName: getTenantField('ownerName') || '',
      landlordContact: getTenantField('ownerContact') || '',
      contractSignedDate: getTenantField('contractSigned')
        ? new Date(getTenantField('contractSigned'))
        : new Date(),
      ownerSignature: getTenantField('ownerSignature') || '',
      tenantSignature: getTenantField('tenantSignature') || '',
      witnesses: getTenantField('witnesses') || ['', ''],
    },
  })

  const addWitness = () => {
    setWitnesses([...witnesses, ''])
  }

  const removeWitness = (index: number) => {
    if (witnesses.length > 2) {
      setWitnesses(witnesses.filter((_, i) => i !== index))
    }
  }

  const updateWitness = (index: number, value: string) => {
    const updatedWitnesses = [...witnesses]
    updatedWitnesses[index] = value
    setWitnesses(updatedWitnesses)
  }

  const handleSubmit = async (data: RentalAgreementData) => {
    if (!apartment) {
      toast.error('No apartment associated with this tenant')
      return
    }

    setIsLoading(true)
    try {
      const agreementData = {
        ...data,
        ownerSignature:
          ownerSignatureFile.imageSrc || getTenantField('ownerSignature') || '',
        tenantSignature:
          tenantSignatureFile.imageSrc ||
          getTenantField('tenantSignature') ||
          '',
        witnesses: witnesses.filter((w) => w.trim() !== ''),
        tenantId: tenant.id,
      }

      const result = await saveRentalAgreement(agreementData)

      if (result.success) {
        toast.success('Rental agreement saved successfully')
      } else {
        toast.error(result.message || 'Failed to save rental agreement')
      }
    } catch (error) {
      toast.error('An error occurred while saving the agreement')
    } finally {
      setIsLoading(false)
    }
  }

  if (!apartment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Rental Agreement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            No apartment is currently associated with this tenant.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='col-span-2'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Room Rental Agreement
          {getTenantField('contractSigned') && (
            <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
              Agreement Signed
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className='space-y-6'
        >
          {/* Agreement Date */}
          <div className='space-y-2'>
            <p>This agreement is made on this </p>
            <Controller
              name='agreementDate'
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  defaultDate={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
            <p>, between the following parties:</p>
            {getTenantField('agreementCreated') && (
              <p className='text-xs text-muted-foreground'>
                Originally created:{' '}
                {new Date(
                  getTenantField('agreementCreated')
                ).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Landlord Information */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>LANDLORD:</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Name:</label>
                <Input
                  {...form.register('landlordName', { required: true })}
                  placeholder='Landlord full name'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Contact:
                </label>
                <Input
                  {...form.register('landlordContact', { required: true })}
                  placeholder='Contact number'
                />
              </div>
            </div>
          </div>

          {/* Tenant Information */}
          <div className='space-y-4'>
            <h3 className='font-semibold'>TENANT:</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Name:</label>
                <Input
                  value={`${tenant.firstName} ${tenant.lastName}`}
                  disabled
                  className='bg-muted'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Contact:
                </label>
                <Input
                  value={tenant.contactNumber}
                  disabled
                  className='bg-muted'
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className='space-y-4'>
            <p>The Landlord agrees to rent a room located at:</p>
            <div className='grid grid-cols-1 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Address:
                </label>
                <Input
                  value={apartment.address}
                  disabled
                  className='bg-muted'
                />
              </div>
            </div>

            <div className='grid grid-cols-3 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Monthly Rent:
                </label>
                <Input
                  value={`₱${apartment.monthlyRentalPrice.toLocaleString()}`}
                  disabled
                  className='bg-muted'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Payment Date:
                </label>
                <Input
                  value={`Every ${tenant.monthlyDueDate} of the month`}
                  disabled
                  className='bg-muted'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Advance Deposit:
                </label>
                <Input
                  value={`Two (2) months equivalent to ₱${(
                    apartment.monthlyRentalPrice * 2
                  ).toLocaleString()}`}
                  disabled
                  className='bg-muted'
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className='space-y-2'>
            <p className='text-muted-foreground'>
              The room shall be used for residential purposes only by the tenant
              and their family. Both parties agree to maintain cleanliness,
              avoid disturbances, and respect each other&apos;s rights. Either
              party may end this agreement with a 30-day notice. Any damages
              caused by the tenant shall be subject to deduction from the
              deposit.
            </p>
          </div>

          {/* Signing Date */}
          <div className='space-y-2'>
            <p>Signed on </p>
            <Controller
              name='contractSignedDate'
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  defaultDate={field.value}
                  onSelect={field.onChange}
                />
              )}
            />
            {getTenantField('contractSigned') && (
              <p className='text-xs text-muted-foreground'>
                Previously signed:{' '}
                {new Date(
                  getTenantField('contractSigned')
                ).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Signatures */}
          <div className='space-y-6'>
            <div className='grid grid-cols-2 gap-6'>
              {/* Landlord Signature */}
              <div className='space-y-4'>
                <h3 className='font-semibold'>LANDLORD:</h3>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Signature:
                  </label>
                  <ImageUpload
                    initialImageSrc={
                      getTenantField('ownerSignature') ||
                      ownerSignatureFile.imageSrc ||
                      ''
                    }
                    onImageChange={(params) => {
                      setOwnerSignatureFile(params)
                    }}
                    inputName='ownerSignature'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Printed Name:
                  </label>
                  <Input
                    value={form.watch('landlordName')}
                    disabled
                    className='bg-muted'
                  />
                </div>
              </div>

              {/* Tenant Signature */}
              <div className='space-y-4'>
                <h3 className='font-semibold'>TENANT:</h3>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Signature:
                  </label>
                  <ImageUpload
                    initialImageSrc={
                      getTenantField('tenantSignature') ||
                      tenantSignatureFile.imageSrc ||
                      ''
                    }
                    onImageChange={(params) => {
                      setTenantSignatureFile(params)
                    }}
                    inputName='tenantSignature'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Printed Name:
                  </label>
                  <Input
                    value={`${tenant.firstName} ${tenant.lastName}`}
                    disabled
                    className='bg-muted'
                  />
                </div>
              </div>
            </div>

            {/* Witnesses */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='font-semibold'>WITNESSES:</h3>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={addWitness}
                >
                  <Plus className='w-4 h-4 mr-1' />
                  Add Witness
                </Button>
              </div>

              {witnesses.map((witness, index) => (
                <div
                  key={index}
                  className='flex items-center gap-2'
                >
                  <span className='text-sm font-medium w-8'>{index + 1}.</span>
                  <Input
                    value={witness}
                    onChange={(e) => updateWitness(index, e.target.value)}
                    placeholder={`Witness ${index + 1} name`}
                    className='flex-1'
                  />
                  {witnesses.length > 2 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeWitness(index)}
                    >
                      <Trash2 className='w-4 h-4 text-destructive' />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className='flex justify-end pt-4'>
            <Button
              type='submit'
              disabled={isLoading}
              className='min-w-[120px]'
            >
              {isLoading && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
              Save Agreement
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
