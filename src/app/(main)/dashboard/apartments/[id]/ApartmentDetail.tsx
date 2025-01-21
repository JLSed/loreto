'use client'

import FormGroup from '@/components/shared/forms/FormGroup'
import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useForm } from 'react-hook-form'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { modifyApartment } from '../actions'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import ApartmentStatusLabel from '@/components/shared/ApartmentStatusLabel'
import { ApartmentAvailabilityStatusText } from '@/common/constants/business'

const EditVehicleShema = z.object({
  address: z.string().trim().min(5, 'Please provide the complete address'),
  area: z
    .number({
      required_error: 'Please provide the floor area',
      invalid_type_error: 'Please provide the floor area',
    })
    .min(10, 'Please provide a realistic floor area'),
  monthlyRentalPrice: z
    .number({
      required_error: 'Please provide the monthly rental price',
      invalid_type_error: 'Please provide the monthly rental price',
    })
    .min(1000, 'Please provide a realistic rental price'),
  maxOccupantsPerUnit: z
    .number({
      required_error: 'Please provide the maximum number of occupants',
      invalid_type_error: 'Please provide the maximum number of occupants',
    })
    .min(1, 'Please provide a realistic number of occupants'),
  bedrooms: z
    .number({
      required_error: 'How many bedrooms?',
      invalid_type_error: 'How many bedrooms?',
    })
    .min(1, 'Please provide a realistic number of bedrooms'),
  toiletAndBath: z
    .number({
      required_error: 'How many toilet and bath?',
      invalid_type_error: 'How many toilet and bath?',
    })
    .min(1, 'Please provide a realistic number of toilet and bath'),
  withMotorcycleParkingSpace: z.boolean({
    required_error: 'Please specify the motorcycle parking space',
    invalid_type_error: 'Please specify the motorcycle parking space',
  }),
  withCarParkingSpace: z.boolean({
    required_error: 'Please specify the car parking space',
    invalid_type_error: 'Please specify the car parking space',
  }),
  images: z
    .array(z.string(), { required_error: 'Please provide at least two photos' })
    .min(2, 'Please provide at least two photos'),
  availability_status: z.number(),
})

export type ModifyApartment = z.infer<typeof EditVehicleShema>

export default function ApartmentDetail(props: {
  data: ModifyApartment
  id: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  const inEditMode = searchParams.get('edit') === 'true'

  const form = useForm<ModifyApartment>({
    resolver: zodResolver(EditVehicleShema),
    defaultValues: props.data,
    disabled: !inEditMode || loading,
  })
  const errors = form.formState.errors

  const save = async (data: ModifyApartment) => {
    setLoading(true)

    const payload: Partial<ModifyApartment> = {}

    if (data.address !== props.data.address) {
      payload.address = data.address
    }

    if (data.area !== props.data.area) {
      payload.area = data.area
    }

    if (data.monthlyRentalPrice !== props.data.monthlyRentalPrice) {
      payload.monthlyRentalPrice = data.monthlyRentalPrice
    }

    if (data.maxOccupantsPerUnit !== props.data.maxOccupantsPerUnit) {
      payload.maxOccupantsPerUnit = data.maxOccupantsPerUnit
    }

    if (data.bedrooms !== props.data.bedrooms) {
      payload.bedrooms = data.bedrooms
    }

    if (data.toiletAndBath !== props.data.toiletAndBath) {
      payload.toiletAndBath = data.toiletAndBath
    }

    if (
      data.withMotorcycleParkingSpace !== props.data.withMotorcycleParkingSpace
    ) {
      payload.withMotorcycleParkingSpace = data.withMotorcycleParkingSpace
    }

    if (data.withCarParkingSpace !== props.data.withCarParkingSpace) {
      payload.withCarParkingSpace = data.withCarParkingSpace
    }

    if (data.availability_status !== props.data.availability_status) {
      payload.availability_status = data.availability_status
    }

    if (JSON.stringify(data.images) !== JSON.stringify(props.data.images)) {
      payload.images = data.images
    }

    const res = await modifyApartment(props.id, payload)

    if (res.status === 201) {
      toast.success('Saved', { position: 'top-right' })
      form.reset()
      router.replace('/dashboard/apartments')
      router.refresh()
    } else {
      toast.error(res.message ?? 'Failed to add apartment')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={form.handleSubmit(save)}>
      <header className='p-4 flex items-center justify-between'>
        <h3>Apartment Details</h3>
        {!inEditMode && (
          <Link href={`/dashboard/apartments/${props.id}?edit=true`}>
            <Button type='button'>Edit</Button>
          </Link>
        )}
        {inEditMode && (
          <div className='ml-auto flex gap-2'>
            <Button
              disabled={!form.formState.isDirty}
              loading={loading}
            >
              Save
            </Button>
            <Button
              disabled={loading}
              type='button'
              variant={'outline'}
              onClick={() => {
                form.reset()
                router.back()
              }}
            >
              Discard
            </Button>
          </div>
        )}
      </header>

      <div className='max-w-[850px] m-auto p-4 grid grid-cols-[1.3fr_1fr] gap-4'>
        <div className='space-y-4'>
          <FormGroup groupTitle='Basic Information'>
            <FormItem
              title={'Complete Address'}
              error={errors.address?.message}
            >
              <Input
                placeholder='Enter address'
                {...form.register('address')}
              />
            </FormItem>

            <FormItem
              title={'Floor Area'}
              error={errors.area?.message}
            >
              <div className='flex items-center gap-1'>
                <Input
                  placeholder='e.g. 40'
                  type='number'
                  {...form.register('area', { valueAsNumber: true })}
                />
                <Button
                  disabled
                  size={'icon'}
                  variant={'secondary'}
                >
                  m<sup>2</sup>
                </Button>
              </div>
            </FormItem>

            <div className='grid grid-cols-2 gap-4'>
              <FormItem
                title='Bedrooms'
                error={errors.bedrooms?.message}
              >
                <Input
                  type='number'
                  {...form.register('bedrooms', { valueAsNumber: true })}
                />
              </FormItem>
              <FormItem
                title='Toilet and Bath'
                error={errors.toiletAndBath?.message}
              >
                <Input
                  type='number'
                  {...form.register('toiletAndBath', { valueAsNumber: true })}
                />
              </FormItem>
            </div>

            <FormItem
              title={'Good for how many persons?'}
              error={errors.maxOccupantsPerUnit?.message}
            >
              <Input
                placeholder='e.g. 4'
                type='number'
                {...form.register('maxOccupantsPerUnit', {
                  valueAsNumber: true,
                })}
              />
            </FormItem>
          </FormGroup>

          <FormGroup groupTitle='Amenities'>
            <FormItem
              title='Motorcycle parking'
              error={errors.withMotorcycleParkingSpace?.message}
            >
              <Tabs
                className='w-full'
                {...form.register('withMotorcycleParkingSpace')}
                defaultValue={props.data.withMotorcycleParkingSpace ? '1' : '0'}
                onValueChange={(v) =>
                  form.setValue(
                    'withMotorcycleParkingSpace',
                    v === '1' ? true : false,
                    {
                      shouldValidate: true,
                    }
                  )
                }
              >
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger
                    disabled
                    value='1'
                  >
                    With
                  </TabsTrigger>
                  <TabsTrigger
                    disabled
                    value='0'
                  >
                    Without
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </FormItem>

            <FormItem
              title='Car parking'
              error={errors.withCarParkingSpace?.message}
            >
              <Tabs
                className='w-full'
                {...form.register('withCarParkingSpace')}
                defaultValue={props.data.withCarParkingSpace ? '1' : '0'}
                onValueChange={(v) =>
                  form.setValue(
                    'withCarParkingSpace',
                    v === '1' ? true : false,
                    {
                      shouldValidate: true,
                    }
                  )
                }
              >
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger
                    disabled
                    value='1'
                  >
                    With
                  </TabsTrigger>
                  <TabsTrigger
                    disabled
                    value='0'
                  >
                    Without
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </FormItem>
          </FormGroup>
        </div>

        <div>
          <FormGroup groupTitle='Expenses'>
            <FormItem
              title='Monthly Rental Price'
              error={errors.monthlyRentalPrice?.message}
            >
              <div className='flex items-center gap-2'>
                <div className='text-muted-foreground'>₱</div>
                <Input
                  type='number'
                  {...form.register('monthlyRentalPrice', {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </FormItem>
            <Card className='shadow-none p-5'>
              <div className='space-y-1'>
                <Label>Status</Label>
                <Select
                  defaultValue={props.data.availability_status.toString()}
                  disabled={!inEditMode}
                  onValueChange={(value) =>
                    form.setValue('availability_status', +value, {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1].map((value) => (
                      <SelectItem
                        key={value}
                        value={value.toString()}
                      >
                        <ApartmentStatusLabel availabilityStatus={+value} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </FormGroup>

          {/* <div className='mt-4'>
            <FormItem
              title='Apartment Photos'
              error={errors.images?.message}
            >
              <MultipleImageUpload
                key={form.getValues().images.length}
                disabled={loading || !inEditMode}
                inputName={'images'}
                onImagesChange={(images) => {
                  form.setValue('images', images, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
                initialImageSources={props.data.images}
              />
            </FormItem>
          </div> */}
        </div>
      </div>
    </form>
  )
}
