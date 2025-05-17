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

export function plural(noun: string, number: number, suffix = 's'): string {
  if (number > 1) return noun + suffix
  else return noun
}

const SINGLE_PER_INCH = 0.03
const DOUBLE_PER_INCH = 0.054
type inch = number
type ComputePriceParams = {
  width: inch
  length: inch
  height: inch
  thickness: 'single' | 'double'
}
type ComputePriceReturn = {
  front: number
  back: number
  leftSide: number
  rightSide: number
  top: number
  bottom: number
  frontArea: number
  backArea: number
  leftSideArea: number
  rightSideArea: number
  topArea: number
  bottomArea: number
  totalArea: number
  totalPrice: number
}
export function computePrice({
  width,
  length,
  height,
  thickness,
}: ComputePriceParams): ComputePriceReturn {
  const PER_INCH = thickness === 'single' ? SINGLE_PER_INCH : DOUBLE_PER_INCH

  const topArea = width * length
  const bottomArea = topArea

  const top = topArea * PER_INCH
  const bottom = top

  const leftSideArea = width * height
  const leftSide = leftSideArea * PER_INCH

  const rightSideArea = leftSideArea
  const rightSide = leftSide

  const frontArea = length * height
  const front = frontArea * PER_INCH

  const backArea = frontArea
  const back = front

  return {
    top,
    bottom,
    leftSide,
    rightSide,
    front,
    back,
    topArea,
    bottomArea,
    leftSideArea,
    rightSideArea,
    frontArea,
    backArea,
    totalPrice: top + bottom + leftSide + rightSide + front + back,
    totalArea: (topArea + leftSideArea + frontArea) * 2,
  }
}

export function getPricePerInch(thickness: number) {
  return thickness === 1 ? SINGLE_PER_INCH : DOUBLE_PER_INCH
}

export function withPesosSymbol(str: string | number) {
  return '₱' + str
}

export function getInquiryStatusText(status: number): string {
  switch (status) {
    case 0:
      return 'Pending'
    case 1:
      return 'Responded'
    case 2:
      return 'Closed'
    default:
      return ''
  }
}
