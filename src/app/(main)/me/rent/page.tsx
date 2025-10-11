import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUserTenantDetails } from './rent-actions'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import Image from 'next/image'

export default async function RentPage() {
  const tenantDetails = await getCurrentUserTenantDetails()

  if (!tenantDetails) {
    notFound()
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge variant='default'>Active</Badge>
      case 1:
        return <Badge variant='secondary'>Inactive</Badge>
      case 2:
        return <Badge variant='outline'>Archived</Badge>
      case 3:
        return <Badge variant='destructive'>Due</Badge>
      default:
        return <Badge variant='outline'>Unknown</Badge>
    }
  }

  return (
    <div className='container max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>My Rental Information</h1>

      <div className='grid gap-6'>
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  First Name
                </label>
                <p className='text-lg'>{tenantDetails.firstName}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Last Name
                </label>
                <p className='text-lg'>{tenantDetails.lastName}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Email Address
                </label>
                <p className='text-lg'>{tenantDetails.emailAddress}</p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Contact Number
                </label>
                <p className='text-lg'>{tenantDetails.contactNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Information */}
        <Card>
          <CardHeader>
            <CardTitle>Rental Details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Move-in Date
                </label>
                <p className='text-lg'>
                  {format(new Date(tenantDetails.moveInDate), 'PPP')}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Monthly Due Date
                </label>
                <p className='text-lg'>
                  {tenantDetails.monthlyDueDate} of every month
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Monthly Payment
                </label>
                <p className='text-lg'>
                  ₱{tenantDetails.monthlyPayment.toLocaleString()}
                </p>
              </div>
              <div>
                <label className='text-sm font-medium text-muted-foreground'>
                  Status
                </label>
                <p className='text-lg'>
                  {getStatusBadge(tenantDetails.status)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Agreement Contract */}
        {((tenantDetails as any).agreementCreated ||
          (tenantDetails as any).ownerName) && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                Rental Agreement Contract
                {(tenantDetails as any).contractSigned && (
                  <Badge variant='default'>Signed</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='prose max-w-none'>
                <p>
                  This agreement is made on this{' '}
                  {(tenantDetails as any).agreementCreated
                    ? format(
                        new Date((tenantDetails as any).agreementCreated),
                        'PPP'
                      )
                    : 'N/A'}
                  , between the following parties:
                </p>

                <div className='mt-4'>
                  <h4 className='font-semibold'>LANDLORD:</h4>
                  <p>
                    Name: {(tenantDetails as any).ownerName || 'Not specified'}
                  </p>
                  <p>
                    Contact:{' '}
                    {(tenantDetails as any).ownerContact || 'Not specified'}
                  </p>
                </div>

                <div className='mt-4'>
                  <h4 className='font-semibold'>TENANT:</h4>
                  <p>
                    Name: {tenantDetails.firstName} {tenantDetails.lastName}
                  </p>
                  <p>Contact: {tenantDetails.contactNumber}</p>
                </div>

                {tenantDetails.apartment && (
                  <>
                    <p className='mt-4'>
                      The Landlord agrees to rent a room located at:
                    </p>
                    <div className='ml-4'>
                      <p>Address: {tenantDetails.apartment.address}</p>
                      <p>
                        Monthly Rent: ₱
                        {tenantDetails.apartment.monthlyRentalPrice.toLocaleString()}
                      </p>
                      <p>
                        Payment Date: Every {tenantDetails.monthlyDueDate} of
                        the month
                      </p>
                      <p>
                        Advance Deposit: Two (2) months equivalent to ₱
                        {(
                          tenantDetails.apartment.monthlyRentalPrice * 2
                        ).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}

                <p className='mt-4 text-sm text-muted-foreground'>
                  The room shall be used for residential purposes only by the
                  tenant and their family. Both parties agree to maintain
                  cleanliness, avoid disturbances, and respect each other&apos;s
                  rights. Either party may end this agreement with a 30-day
                  notice. Any damages caused by the tenant shall be subject to
                  deduction from the deposit.
                </p>

                <p className='mt-4'>
                  Signed on{' '}
                  {(tenantDetails as any).contractSigned
                    ? format(
                        new Date((tenantDetails as any).contractSigned),
                        'PPP'
                      )
                    : 'Not yet signed'}
                </p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
                  <div>
                    <h4 className='font-semibold'>LANDLORD:</h4>
                    {(tenantDetails as any).ownerSignature && (
                      <div className='mt-2 mb-2'>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Signature:
                        </p>
                        <Image
                          src={(tenantDetails as any).ownerSignature}
                          alt='Landlord Signature'
                          width={200}
                          height={100}
                          className='max-w-[200px] h-auto border rounded'
                        />
                      </div>
                    )}
                    <p>
                      Printed Name:{' '}
                      {(tenantDetails as any).ownerName || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h4 className='font-semibold'>TENANT:</h4>
                    {(tenantDetails as any).tenantSignature && (
                      <div className='mt-2 mb-2'>
                        <p className='text-sm text-muted-foreground mb-1'>
                          Signature:
                        </p>
                        <Image
                          src={(tenantDetails as any).tenantSignature}
                          alt='Tenant Signature'
                          width={200}
                          height={100}
                          className='max-w-[200px] h-auto border rounded'
                        />
                      </div>
                    )}
                    <p>
                      Printed Name: {tenantDetails.firstName}{' '}
                      {tenantDetails.lastName}
                    </p>
                  </div>
                </div>

                {(tenantDetails as any).witnesses &&
                  (tenantDetails as any).witnesses.length > 0 && (
                    <div className='mt-6'>
                      <h4 className='font-semibold'>WITNESSES:</h4>
                      {(tenantDetails as any).witnesses.map(
                        (witness: string, index: number) => (
                          <p key={index}>
                            {index + 1}. {witness}
                          </p>
                        )
                      )}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment History */}
        {tenantDetails.Transaction && tenantDetails.Transaction.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {tenantDetails.Transaction.slice(0, 5).map(
                  (transaction, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center p-3 border rounded-lg'
                    >
                      <div>
                        <p className='font-medium'>
                          ₱{transaction.amount.toLocaleString()}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {format(new Date(transaction.createdAt), 'PPP')}
                        </p>
                      </div>
                      <Badge variant='outline'>
                        {transaction.type === 1
                          ? 'Full Payment'
                          : transaction.type === 2
                          ? 'Partial Payment'
                          : transaction.type === 3
                          ? 'Down Payment'
                          : 'Payment'}
                      </Badge>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
