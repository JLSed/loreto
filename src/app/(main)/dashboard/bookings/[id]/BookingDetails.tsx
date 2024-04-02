'use client'

import { BookingStatusTexts } from '@/common/constants/business'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getBookingById, updateBookingStatus } from './actions'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import BookingStatusLabel from '@/components/shared/BookingStatusLabel'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Booking = Awaited<ReturnType<typeof getBookingById>>

export default function BookingDetails({ data }: { data: Booking }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(data.status)
  const router = useRouter()

  async function save() {
    try {
      setLoading(true)
      const res = await updateBookingStatus(data.id, status)
      if (res.status === 201) {
        toast.success('Status updated successfully')
        router.back()
        router.refresh()
        return
      }

      toast.error('Failed to update status. Please try again.')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='max-w-md m-auto'>
      <Card className='shadow-none'>
        <CardHeader>
          <CardTitle className='text-base'>Update status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-1'>
            <Label>Status</Label>
            <Select
              disabled={loading}
              defaultValue={data.status.toString()}
              onValueChange={(value) => {
                setStatus(+value)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(BookingStatusTexts).map(([key, value]) => (
                  <SelectItem
                    key={key}
                    value={key}
                  >
                    <BookingStatusLabel status={+key} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='mt-8 flex justify-end'>
            <Button
              loading={loading}
              onClick={save}
              disabled={status === data.status || loading}
            >
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
