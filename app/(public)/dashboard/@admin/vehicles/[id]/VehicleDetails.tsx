/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn, formatDate } from '@/lib/utils'
import { Vehicle } from '@prisma/client'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VehicleStatusLabel } from '@/common/constants/business'
export default function VehicleDetails({ data }: { data: Vehicle }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const readOnly = searchParams.get('action') !== 'edit'

  const startEditing = () => {
    router.replace(`${pathname}?action=edit`)
  }
  const discard = () => {
    router.replace(pathname)
  }

  return (
    <div className='bg-neutral-50'>
      <header className='p-4 flex items-center gap-2 justify-between'>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => router.back()}
            variant={'ghost'}
            size={'icon'}
          >
            <ArrowLeftIcon />
          </Button>
          <h3 className='capitalize'>Vehicle Details</h3>
        </div>

        <div className={cn({ hidden: readOnly }, 'space-x-3')}>
          <Button disabled>Save</Button>
          <Button
            onClick={discard}
            variant={'outline'}
          >
            Discard
          </Button>
        </div>

        <Button
          className={cn({ hidden: !readOnly })}
          onClick={startEditing}
        >
          Edit
        </Button>
      </header>

      <div className='grid grid-cols-12 p-4 gap-4 w-[850px] m-auto'>
        <div className='col-span-7 space-y-4'>
          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle className='text-base'>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1'>
                <Label
                  htmlFor='vehicle_name'
                  className='small'
                >
                  Vehicle Name
                </Label>
                <Input
                  ref={(ref) => !readOnly && ref?.focus()}
                  id='vehicle_name'
                  defaultValue={data.name}
                  name='name'
                  readOnly={readOnly}
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='model'>Model</Label>
                <Input
                  id='model'
                  defaultValue={data.model}
                  name='model'
                  readOnly={readOnly}
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='plateNumber'>Plate Number</Label>
                <Input
                  id='plateNumber'
                  defaultValue={data.plateNumber}
                  name='plateNumber'
                  readOnly={readOnly}
                />
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle className='text-base'>History</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1'>
                <Label htmlFor='lastMaintenance'>Last Maintenance</Label>
                <Input
                  id='lastMaintenance'
                  defaultValue={
                    data.lastMaintenance
                      ? formatDate(data.lastMaintenance.toString())
                      : undefined
                  }
                  name='lastMaintenance'
                  readOnly={readOnly}
                />
              </div>
              <div className='space-y-1'>
                <Label htmlFor='purchaseDate'>Purchased On</Label>
                <Input
                  id='purchaseDate'
                  defaultValue={formatDate(data.purchaseDate.toString())}
                  name='purchaseDate'
                  readOnly={readOnly}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='col-span-5 space-y-4'>
          <img
            alt={data.name}
            src={data.photoUrl}
            className='rounded-xl border'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />

          <Card className='shadow-none p-5'>
            <div className='space-y-1'>
              <Label>Status</Label>
              <Select
                defaultValue={data.status.toString()}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(VehicleStatusLabel).map(([key, value]) => (
                    <SelectItem
                      key={key}
                      value={key}
                    >
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
