'use client'

import MultipleImageUpload from '@/components/shared/MultipleImageUpload'
import FormGroup from '@/components/shared/forms/FormGroup'
import FormItem from '@/components/shared/forms/FormItem'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const NewApartmentSchema = z.object({
  address: z.string().trim().min(5, 'Please provide a complete address'),
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
})
type NewApartment = z.infer<typeof NewApartmentSchema>

export default function AddNewApartment() {
  const form = useForm<NewApartment>({
    resolver: zodResolver(NewApartmentSchema),
    defaultValues: {
      bedrooms: 1,
      toiletAndBath: 1,
    },
  })
  const errors = form.formState.errors

  const submit = (data: NewApartment) => {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <header className='p-4 flex items-center justify-between'>
        <h3>Add new apartment</h3>
        <Button>Save</Button>
      </header>

      <div className='max-w-[850px] m-auto p-4 grid grid-cols-[1.3fr_1fr] gap-4'>
        <div className='space-y-4'>
          <FormGroup groupTitle='Basic Information'>
            <FormItem
              title={'Address'}
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
