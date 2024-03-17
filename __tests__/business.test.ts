import { BoxThickness } from '@/common/enums/enums.db'
import { computePrice, computeTotalBoxArea } from '@/lib/business'

describe('compute box area and price', () => {
  const area = computeTotalBoxArea({ width: 2, height: 3, length: 4 })

  it('should return the total area of the box', () => {
    expect(area).toBe(52)
  })

  it('should compute the price of single thickness box', () => {
    const totalPrice = computePrice(area, BoxThickness.Single)
    expect(totalPrice).toBe(312)
  })

  it('should compute the price of double thickness box', () => {
    const totalPrice = computePrice(area, BoxThickness.Double)
    expect(totalPrice).toBe(416)
  })
})
