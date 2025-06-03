'use client'

import { TenantStatus } from '@/common/enums/enums.db'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { updateTenantStatus } from './tenants-action'
import { Loader2Icon } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
  status: TenantStatus
  tenantId: number
}

export default function TenantStatusUpdater(props: Props) {
  const [status, setStatus] = useState(props.status.toString())
  const [isLoading, setIsLoading] = useState(false)

  const hasChanged = props.status !== +status

  const handleSave = async () => {
    if (!hasChanged) return
    setIsLoading(true)
    await updateTenantStatus({
      tenantId: props.tenantId,
      status: +status,
    })
    setIsLoading(false)
    toast.success('Status updated.', {
      richColors: true,
      position: 'top-right',
    })
  }

  return (
    <div className='flex gap-2 items-center'>
      <Select
        value={status}
        onValueChange={setStatus}
      >
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder='Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='0'>Active</SelectItem>
          <SelectItem value='1'>Inactive</SelectItem>
          <SelectItem value='2'>Archived</SelectItem>
        </SelectContent>
      </Select>
      <Button
        className='w-[70px]'
        onClick={handleSave}
        disabled={!hasChanged || isLoading}
        size={'sm'}
      >
        {isLoading ? <Loader2Icon className='w-4 h-4 animate-spin' /> : 'Save'}
      </Button>
    </div>
  )
}
