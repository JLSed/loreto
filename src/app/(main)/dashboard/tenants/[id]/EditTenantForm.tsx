'use client'

import FormGroup from '@/components/shared/forms/FormGroup'
import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tenant, Apartment } from '@prisma/client'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { updateTenantInfo } from '../tenants-action'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RentalAgreementForm from './RentalAgreementForm'

interface Props {
  tenant: Tenant
  apartment: Apartment | null
}

export default function EditTenantForm(props: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<Tenant>({
    defaultValues: props.tenant,
  })

  async function handleSubmit() {
    setIsLoading(true)
    const values = form.getValues()
    await updateTenantInfo(props.tenant.id, {
      ...values,
      monthlyDueDate: values.monthlyDueDate
        ? +values.monthlyDueDate
        : values.monthlyDueDate,
      monthlyPayment: values.monthlyPayment
        ? +values.monthlyPayment
        : values.monthlyPayment,
    })
    setIsLoading(false)
    router.back()
  }

  return (
    <div>
      <header className='p-4 flex items-center justify-between'>
        <h2>Edit Tenant Details</h2>
        <Link href={'/dashboard/tenants'}>
          <Button variant='secondary'>Go Back</Button>
        </Link>
      </header>
      <div className='mx-auto max-w-6xl space-y-8'>
        <form
          className='grid grid-cols-2 gap-4'
          action={handleSubmit}
        >
          <FormGroup groupTitle='Tenant Information'>
            <FormItem title='First Name'>
              <Input
                required
                {...form.register('firstName')}
              />
            </FormItem>
            <FormItem title='Last Name'>
              <Input
                required
                {...form.register('lastName')}
              />
            </FormItem>
            <FormItem title='Contact Number'>
              <Input
                required
                maxLength={11}
                pattern='[0-9]{11}'
                inputMode='numeric'
                placeholder='09XXXXXXXXX'
                title='Contact number must be exactly 11 digits'
                {...form.register('contactNumber')}
              />
            </FormItem>
            <FormItem title='Email Address'>
              <Input
                required
                {...form.register('emailAddress')}
              />
            </FormItem>
          </FormGroup>

          <FormGroup groupTitle='Tenancy Details'>
            <FormItem title='Monthly Payment (PHP)'>
              <Input
                required
                type='number'
                {...form.register('monthlyPayment')}
              />
            </FormItem>
            <FormItem title='Move in Date'>
              <Controller
                name='moveInDate'
                control={form.control}
                defaultValue={props.tenant.moveInDate}
                render={({ field }) => (
                  <Input
                    type='date'
                    required
                    {...field}
                    value={format(form.watch('moveInDate'), 'yyyy-MM-dd')}
                  />
                )}
              />
            </FormItem>
            <FormItem title='Monthly Due Date (Ex: Every 30)'>
              <Input
                required
                type='number'
                {...form.register('monthlyDueDate')}
              />
            </FormItem>
          </FormGroup>

          <div></div>
          <div className='flex justify-end mt-4'>
            <Button
              disabled={!form.formState.isDirty || isLoading}
              className='w-[100px]'
            >
              {isLoading && <Loader2 className='w-4 h-4 animate-spin mr-1' />}
              Submit
            </Button>
          </div>
        </form>

        {/* Rental Agreement Section */}
        <RentalAgreementForm
          tenant={props.tenant}
          apartment={props.apartment}
        />
      </div>
    </div>
  )
}
