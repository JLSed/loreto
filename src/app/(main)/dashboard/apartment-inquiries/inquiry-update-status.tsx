'use client'

import { useState } from 'react'
import { Inquiry } from './page'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateInquiryStatus } from './inquiry-actions'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'

type Props = {
  inquiry: Inquiry
}

export default function InquiryUpdateStatus({ inquiry }: Props) {
  const [status, setStatus] = useState(inquiry.status.toString())
  const statusChanged = +status !== inquiry.status
  const router = useRouter()

  const handleUpdateStatus = async (formData: FormData) => {
    await updateInquiryStatus(
      +status,
      inquiry.id,
      formData.get('remarks') as string
    )
    router.refresh()
  }

  return (
    <form action={handleUpdateStatus}>
      <Select
        defaultValue={status}
        onValueChange={setStatus}
      >
        <SelectTrigger className='w-[160px]'>
          <SelectValue placeholder='Select a status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'0'}>Pending</SelectItem>
          <SelectItem value={'1'}>Responded</SelectItem>
          <SelectItem value={'2'}>Closed</SelectItem>
        </SelectContent>
      </Select>
      {statusChanged && (
        <div className='mt-2 flex gap-2 items-center'>
          <Input
            name='remarks'
            placeholder='Remarks (Optional)'
            autoFocus={statusChanged}
          />{' '}
          <SubmitButton />
        </div>
      )}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      className='w-[100px]'
      size={'sm'}
      loading={pending}
    >
      Save
    </Button>
  )
}
