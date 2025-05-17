'use client'

import { Apartment } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createApartmentInquiry } from './apartment-actions'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { useState } from 'react'

type Props = {
  apartment: Apartment
}

export default function ApartmentInquiry(props: Props) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    const res = await createApartmentInquiry(formData, props.apartment.id)
    if (res.status === 500) {
      toast.error(res.message, {
        richColors: true,
      })
    } else {
      toast.success(res.message, {
        richColors: true,
      })
      setOpen(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>Inquire</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apartment Inquiry</DialogTitle>
          <DialogDescription>
            Fill out the form and we will reach to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        <form
          className='space-y-2'
          action={handleSubmit}
        >
          <div>
            <Label>First Name</Label>
            <Input
              required
              name='first_name'
              placeholder='First name'
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <Input
              required
              name='last_name'
              placeholder='Last name'
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              required
              type='email'
              name='email'
              placeholder='Email'
            />
          </div>
          <div>
            <Label>Contact Number</Label>
            <Input
              required
              name='contact_number'
              placeholder='Contact Number'
            />
          </div>
          <div>
            <Label>Preferred Date to Visit</Label>
            <Input
              required
              name='visitation_date'
              type='date'
            />
          </div>
          <div className='flex justify-end pt-4'>
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      className='w-[100px]'
      loading={pending}
    >
      Submit
    </Button>
  )
}
