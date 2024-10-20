import { z } from 'zod'

export const NewPasswordSchema = z
  .object({
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
export type NewPassword = z.infer<typeof NewPasswordSchema>
