import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrentUserTenantDetails } from './rent-actions'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'

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
