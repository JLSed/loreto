'use client'

import FormGroup from '@/components/shared/forms/FormGroup'
import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { addNewTenant, TNewTenant } from '../tenants-action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function NewTenantPage() {
  const router = useRouter()
  const handleSubmit = async (fd: FormData) => {
    const payload: TNewTenant = {
      firstName: fd.get('first_name') as string,
      lastName: fd.get('last_name') as string,
      contactNumber: fd.get('contact_number') as string,
      moveInDate: fd.get('movein_date') as string,
      monthlyDueDate: +(fd.get('monthly_due_date') as string),
      monthlyPayment: +(fd.get('monthly_payment') as string),
      emailAddress: fd.get('email') as string,
    }
    const added = await addNewTenant(payload)
    if (!added) {
      toast.error('Something went wrong. Please try again.')
      return
    }
    router.replace('/dashboard/tenants')
  }

  return (
    <div>
      <header className='p-4 flex items-center justify-between'>
        <h2>Add new tenant</h2>
      </header>
      <form
        className='mx-auto max-w-3xl grid grid-cols-2 gap-4'
        action={handleSubmit}
      >
        <FormGroup groupTitle='Tenant Information'>
          <FormItem title='First Name'>
            <Input
              required
              name='first_name'
            />
          </FormItem>
          <FormItem title='Last Name'>
            <Input
              required
              name='last_name'
            />
          </FormItem>
          <FormItem title='Contact Number'>
            <Input
              required
              name='contact_number'
            />
          </FormItem>
          <FormItem title='Email Address'>
            <Input
              required
              name='email'
            />
          </FormItem>
        </FormGroup>

        <FormGroup groupTitle='Tenancy Details'>
          <FormItem title='Monthly Payment (PHP)'>
            <Input
              required
              type='number'
              name='monthly_payment'
            />
          </FormItem>
          <FormItem title='Move in Date'>
            <Input
              required
              type='date'
              name='movein_date'
            />
          </FormItem>
          <FormItem title='Monthly Due Date (Ex: Every 30)'>
            <Input
              required
              type='number'
              name='monthly_due_date'
            />
          </FormItem>
        </FormGroup>

        <div></div>
        <div className='flex justify-end mt-4'>
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      disabled={pending}
      className='w-[100px]'
    >
      {pending && <Loader2 className='w-4 h-4 animate-spin mr-1' />}
      Submit
    </Button>
  )
}
