'use client'

import { cn, computePrice, pesos } from '@/lib/utils'
import { Box, BoxMarking, ImageMarking } from '@prisma/client'
import { Render2DBox } from '../BoxQuotation'

interface Props {
  box: Box
  markings: BoxMarking[]
  imageMarkings: ImageMarking[]
  rootClassName?: string
  scaleFactor?: number
}

export default function BoxPreview({ box, rootClassName }: Props) {
  const leftWidth = box.totalWidth * (box.leftPanelSize / 100)
  const rightWidth = box.totalWidth * (box.rightPanelSize / 100)

  // Use a fixed scale factor of 8 to match the quotation view
  const scaleFactor = 8

  return (
    <div className='w-full h-full max-w-full overflow-hidden'>
      <div className='mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200'>
        <div className='text-sm text-gray-600 mb-2'>
          Unit of Measurement:{' '}
          <code className='bg-gray-100 px-1 rounded'>inch</code>
        </div>
        <div className='text-sm font-medium'>
          <span className='text-green-600'>
            Cost:{' '}
            {pesos(
              computePrice({
                width: leftWidth,
                length: rightWidth,
                height: box.height,
                thickness: box.thickness === 1 ? 'single' : 'double',
              }).totalPrice
            )}
          </span>{' '}
          <span className='text-gray-500'>
            - Thickness: {box.thickness === 1 ? 'Single' : 'Double'}
          </span>
        </div>
      </div>
      <div
        className={cn(
          'w-full max-w-full h-[calc(100vh-200px)] overflow-auto p-4',
          rootClassName
        )}
      >
        <Render2DBox
          scaleFactor={scaleFactor}
          width={leftWidth}
          length={rightWidth}
          height={box.height}
          thickness={box.thickness}
        />
      </div>
    </div>
  )
}
