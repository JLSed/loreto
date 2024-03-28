'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import ImageUpload from '@/components/shared/ImageUpload'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VehicleStatus } from '@/common/enums/enums.db'
import StatusWithDot from '@/components/shared/StatusWithDot'
import { VehicleStatusLabel } from '@/common/constants/business'
import { VehicleStatusColor } from '@/common/constants/status-colors'
import { useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNewVehicle } from './new-vehicle-action'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const NewVehicleInputSchema = z.object({
  name: z.string().trim().min(1, 'Please enter a complete vehilc name'),
  model: z.string().trim().min(1, 'Please enter a complete model name'),
  plateNumber: z.string().trim().min(6, 'Please enter a valid plate number'),
  purchaseDate: z.string().min(1, 'Please select the date of purchase'),
  lastMaintenance: z.string().optional(),
  status: z.number(),
  serviceFeePerHour: z.number().min(10, 'Please provide a valid service fee'),
  photo: z.string({ required_error: 'Please upload a vehicle photo' }),
})

export type NewVehicleInput = z.infer<typeof NewVehicleInputSchema>

export default function NewVehicle() {
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const form = useForm<NewVehicleInput>({
    disabled: isSaving,
    resolver: zodResolver(NewVehicleInputSchema),
    defaultValues: {
      status: VehicleStatus.Available,
      serviceFeePerHour: 0,
    },
  })

  const onSubmit = async (data: NewVehicleInput) => {
    try {
      setIsSaving(true)
      const res = await createNewVehicle(data)
      if (res.status === 200) {
        router.back()
        router.refresh()
        toast('Successfully added new vehicle')
        return
      }
      toast.error('Something went wrong. Please try again')
    } catch (error) {
      toast.error('Something went wrong. Please try again')
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <header className='p-4 flex items-center justify-between'>
        <h3>New Vehicle</h3>
        <Button loading={isSaving}>Save</Button>
      </header>

      <div className='grid grid-cols-12 p-4 gap-4 w-[850px] m-auto'>
        <div
          aria-label='right side'
          className='col-span-7 space-y-4'
        >
          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle className='text-base'>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1'>
                <Label htmlFor='name'>Vehicle Name</Label>
                <Input
                  id='name'
                  {...form.register('name')}
                  placeholder='Enter vehicle name'
                />
                {form.formState.errors.name && (
                  <div className='text-xs text-red-700 font-medium'>
                    {form.formState.errors.name.message}
                  </div>
                )}
              </div>
              <div className='space-y-1'>
                <Label htmlFor='model'>Vehicle Model</Label>
                <Input
                  id='model'
                  {...form.register('model')}
                  placeholder='Enter model'
                />
                {form.formState.errors.model && (
                  <div className='text-xs text-red-700 font-medium'>
                    {form.formState.errors.model.message}
                  </div>
                )}
              </div>
              <div className='space-y-1'>
                <Label htmlFor='plateNumber'>Plate Number</Label>
                <Input
                  id='plateNumber'
                  {...form.register('plateNumber')}
                  placeholder='Enter plate number'
                />
                {form.formState.errors.plateNumber && (
                  <div className='text-xs text-red-700 font-medium'>
                    {form.formState.errors.plateNumber.message}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-none'>
            <CardHeader>
              <CardTitle className='text-base'>History</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-2 place-items-start gap-4'>
              <div className='space-y-1'>
                <Label htmlFor='purchaseDate'>Purchased On</Label>
                <Input
                  type='date'
                  id='purchaseDate'
                  {...form.register('purchaseDate')}
                />
                {form.formState.errors.purchaseDate && (
                  <div className='text-xs text-red-700 font-medium'>
                    {form.formState.errors.purchaseDate.message}
                  </div>
                )}
              </div>
              <div className='space-y-1'>
                <Label htmlFor='lastMaintenance'>Last Maintenance</Label>
                <Input
                  type='date'
                  placeholder='Last maintenance'
                  {...form.register('lastMaintenance')}
                />
                <span className='text-muted-foreground text-xs'>Optional</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          aria-label='right side'
          className='col-span-5 space-y-4'
        >
          <div>
            <ImageUpload
              onImageChange={({ imageSrc }) => {
                if (!imageSrc) return
                form.setError('photo', { message: undefined })
                form.setValue('photo', imageSrc, { shouldDirty: true })
              }}
              inputName={'photo'}
            />
            {form.formState.errors.photo && (
              <div className='text-xs text-red-700 font-medium'>
                {form.formState.errors.photo.message}
              </div>
            )}
          </div>

          <Card className='shadow-none p-5'>
            <div className='space-y-1'>
              <Label>Status</Label>
              <Select
                name='status'
                onValueChange={(value) =>
                  form.setValue('status', +value, { shouldDirty: true })
                }
                defaultValue={form.formState.defaultValues?.status?.toString()}
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
                      <StatusWithDot
                        label={value}
                        color={VehicleStatusColor[+key as VehicleStatus]}
                      />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className='shadow-none p-5'>
            <div className='space-y-1'>
              <Label htmlFor='serviceFeePerHour'>Service Fee per hour</Label>
              <div className='flex items-center gap-2'>
                <span className='muted'>PHP</span>
                <div>
                  <Input
                    type='number'
                    placeholder='0'
                    {...form.register('serviceFeePerHour', {
                      valueAsNumber: true,
                    })}
                  />
                  {form.formState.errors.serviceFeePerHour && (
                    <div className='text-xs text-red-700 font-medium'>
                      {form.formState.errors.serviceFeePerHour.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  )
}
