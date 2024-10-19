import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function pesos(amount: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    ...options,
  }).format(amount)
}

export const randomIntSequenceString = (length: number): string => {
  let otp = ''
  const characters = '0123456789'
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return otp
}
