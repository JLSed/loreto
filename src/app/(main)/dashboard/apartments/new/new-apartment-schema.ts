import { z } from 'zod'

export const NewApartmentSchema = z.object({
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
})

export type NewApartment = z.infer<typeof NewApartmentSchema>
