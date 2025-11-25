'use client'

import FormGroup from '@/components/shared/forms/FormGroup'
import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { addNewTenant, TNewTenant } from '../tenants-action'
import { getAvailableApartments } from '../../apartments/dashboard-apartment-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function NewTenantPage() {
  const router = useRouter()
  const [availableApartments, setAvailableApartments] = useState<
    Array<{ id: string; address: string; monthlyRentalPrice: number }>
  >([])
  const [selectedApartment, setSelectedApartment] = useState<string>('')

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const apartments = await getAvailableApartments()
        setAvailableApartments(apartments)
      } catch (error) {
        console.error('Failed to fetch apartments:', error)
        toast.error('Failed to load available apartments')
      }
    }
    fetchApartments()
  }, [])

  const handleSubmit = async (fd: FormData) => {
    const payload: TNewTenant = {
      firstName: fd.get('first_name') as string,
      lastName: fd.get('last_name') as string,
      contactNumber: fd.get('contact_number') as string,
      moveInDate: fd.get('movein_date') as string,
      monthlyDueDate: +(fd.get('monthly_due_date') as string),
      apartmentId: fd.get('apartment_id') as string,
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
        <Link href={'/dashboard/tenants'}>
          <Button variant='secondary'>Go Back</Button>
        </Link>
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
              maxLength={11}
              pattern='[0-9]{11}'
              inputMode='numeric'
              placeholder='09XXXXXXXXX'
              title='Contact number must be exactly 11 digits'
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
          <FormItem title='Apartment Occupied'>
            <Select
              value={selectedApartment}
              onValueChange={setSelectedApartment}
              name='apartment_id'
              required
            >
              <SelectTrigger>
                <SelectValue placeholder='Select an available apartment' />
              </SelectTrigger>
              <SelectContent>
                {availableApartments.map((apartment) => (
                  <SelectItem
                    key={apartment.id}
                    value={apartment.id}
                  >
                    {apartment.address} - ₱
                    {apartment.monthlyRentalPrice.toLocaleString()}/month
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type='hidden'
              name='apartment_id'
              value={selectedApartment}
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
