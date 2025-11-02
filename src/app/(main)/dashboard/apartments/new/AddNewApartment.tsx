'use client'

import MultipleImageUpload from '@/components/shared/MultipleImageUpload'
import FormGroup from '@/components/shared/forms/FormGroup'
import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { NewApartment, NewApartmentSchema } from './new-apartment-schema'
import { createNewApartment } from '../actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddNewApartment() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const form = useForm<NewApartment>({
    resolver: zodResolver(NewApartmentSchema),
    defaultValues: {
      bedrooms: 1,
      toiletAndBath: 1,
    },
    disabled: loading,
  })
  const errors = form.formState.errors

  const submit = async (data: NewApartment) => {
    setLoading(true)
    const res = await createNewApartment(data)
    if (res.status === 200) {
      form.reset()
      router.back()
      router.refresh()
      toast.success('Apartment added successfully', {
        position: 'top-right',
      })
    } else {
      toast.error(res.message ?? 'Failed to add apartment', {
        position: 'top-right',
      })
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className='min-h-screen'
    >
      <header className='sticky top-0 z-10 bg-background border-b p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h3 className='text-lg sm:text-xl font-semibold'>
            Add New Apartment
          </h3>
          <p className='text-sm text-muted-foreground mt-1'>
            Fill in the details to add a new rental property
          </p>
        </div>
        <Button
          loading={loading}
          className='w-full sm:w-auto'
        >
          Save Apartment
        </Button>
      </header>

      <div className='container mx-auto max-w-6xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 lg:gap-8'>
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

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
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
                  <TabsTrigger value='1'>With</TabsTrigger>
                  <TabsTrigger value='0'>Without</TabsTrigger>
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
                  <TabsTrigger value='1'>With</TabsTrigger>
                  <TabsTrigger value='0'>Without</TabsTrigger>
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
          </FormGroup>

          <div className='mt-4'>
            <FormItem
              title='Apartment Photos'
              error={errors.images?.message}
            >
              <MultipleImageUpload
                disabled={loading}
                inputName={'images'}
                onImagesChange={(images) =>
                  form.setValue('images', images, { shouldValidate: true })
                }
              />
            </FormItem>
          </div>
        </div>
      </div>
    </form>
  )
}
