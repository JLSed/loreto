import { PRICE_PER_SQUAREFOOT } from '@/common/constants/business'
import { BoxThickness } from '@/common/enums/enums.db'

export function computeTotalBoxArea(params: {
  height: number
  length: number
  width: number
}) {
  const { height, length, width } = params

  const sideArea = width * height * 2
  const frontBackArea = length * height * 2
  const topBottom = length * width * 2

  return sideArea + frontBackArea + topBottom
}

export function computePrice(area: number, thickness: BoxThickness) {
  if (thickness === BoxThickness.Single) {
    return area * PRICE_PER_SQUAREFOOT.SINGLE
  }
  return area * PRICE_PER_SQUAREFOOT.DOUBLE
}
