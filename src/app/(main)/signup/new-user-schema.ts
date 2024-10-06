import { z } from 'zod'

export const NewUserSchema = z
  .object({
    email: z
      .string({
        required_error: 'This field is required',
      })
      .email('Please enter a valid email'),
    firstName: z
      .string({
        required_error: 'This field is required',
      })
      .min(1, 'This field is required'),
    lastName: z
      .string({
        required_error: 'This field is required',
      })
      .min(1, 'This field is required'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
export type NewUser = z.infer<typeof NewUserSchema>
