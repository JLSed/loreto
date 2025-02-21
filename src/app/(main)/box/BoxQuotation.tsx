'use client'

import { createPortal } from 'react-dom'
import useBoxControls from './useBoxControls'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { computePrice, getPricePerInch } from '@/lib/utils'
import { SlidingNumber } from '@/components/ui/sliding-number'
import { useState } from 'react'

type Props = {
  controls: ReturnType<typeof useBoxControls>
}

export default function BoxQuotation(props: Props) {
  const toggleQuotationOpen = () => {
    props.controls.setQuotationOpen((o) => !o)
  }

  const computation = computePrice({
    height: props.controls.height,
    length: props.controls.pixelLength,
    width: props.controls.pixelWidth,
    thickness: props.controls.boxThickness === 1 ? 'single' : 'double',
  })

  const [scaleFactor, setScaleFactor] = useState(8)
  const color = '#af8e76'
  const createBox = (w: number, label = '') => {
    return (
      <div
        className='border h-full text-xs grid place-items-center text-white'
        style={{
          width: `${w * scaleFactor}px`,
          backgroundColor: color,
          backgroundImage: 'url(/karton.avif)',
        }}
      >
        {label}
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={toggleQuotationOpen}
        variant='outline'
      >
        See Quotation
      </Button>
      {props.controls.quotationOpen &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='fixed top-0 left-0 w-full h-full bg-black/40'
          >
            <Button
              size={'icon'}
              variant={'secondary'}
              onClick={toggleQuotationOpen}
              className='absolute top-4 right-4 rounded-full'
            >
              <XIcon />
            </Button>

            <div className='w-full h-full grid place-items-center'>
              <div className='bg-white shadow rounded p-8'>
                <div className='flex items-start justify-between'>
                  <div className='font-bold'>Your Box Quotation</div>
                  <div className='font-medium text-primary text-sm'>
                    @LoretoTrading
                  </div>
                </div>

                <section className='grid grid-cols-2 gap-4 w-1/2 mt-8 items-center'>
                  <div>Thickness:</div>
                  <div className='flex items-center gap-1'>
                    <Button
                      size={'sm'}
                      variant={
                        props.controls.boxThickness == 1 ? 'outline' : 'ghost'
                      }
                      onClick={() => props.controls.setBoxThickness(1)}
                    >
                      Single
                    </Button>
                    <Button
                      size={'sm'}
                      variant={
                        props.controls.boxThickness == 2 ? 'outline' : 'ghost'
                      }
                      onClick={() => props.controls.setBoxThickness(2)}
                    >
                      Double
                    </Button>
                  </div>

                  <div>
                    Price/
                    <code>
                      <sup>2</sup>inch
                    </code>
                    :
                  </div>
                  <div>
                    <SlidingNumber
                      value={
                        +getPricePerInch(props.controls.boxThickness).toFixed(2)
                      }
                    />
                  </div>

                  <div>Height:</div>
                  <div>
                    {props.controls.height}
                    <code>in</code>{' '}
                  </div>

                  <div>Width:</div>
                  <div>
                    {props.controls.pixelWidth}
                    <code>in</code>{' '}
                  </div>

                  <div>Length:</div>
                  <div>
                    {props.controls.pixelLength}
                    <code>in</code>{' '}
                  </div>

                  <div>Total Box Area:</div>
                  <div>
                    {computation.totalArea}
                    <code>
                      <sup>2</sup>inch
                    </code>
                  </div>

                  <div className='font-bold'>Total Cost:</div>
                  <div className='font-bold inline-flex border-b-4'>
                    ₱
                    <SlidingNumber value={+computation.totalPrice.toFixed(2)} />
                  </div>
                </section>

                <section
                  className='mt-8 h-auto'
                  style={{
                    width: `${
                      (props.controls.pixelWidth + props.controls.pixelLength) *
                        2 *
                        scaleFactor +
                      (props.controls.pixelWidth / 2) * scaleFactor
                    }px`,
                  }}
                >
                  <div
                    className='flex'
                    style={{
                      height: `${
                        (props.controls.pixelWidth * scaleFactor) / 2
                      }px`,
                    }}
                  >
                    {createBox(props.controls.pixelWidth, 'Top side cover')}
                    {createBox(props.controls.pixelLength, 'Top long cover')}
                    {createBox(props.controls.pixelWidth, 'Top side cover')}
                    {createBox(props.controls.pixelLength, 'Top long cover')}
                  </div>

                  <div
                    className='flex items-center'
                    style={{
                      height: `${props.controls.height * scaleFactor}px`,
                    }}
                  >
                    {createBox(props.controls.pixelWidth, 'Left side')}
                    {createBox(props.controls.pixelLength, 'Front')}
                    {createBox(props.controls.pixelWidth, 'Right side')}
                    {createBox(props.controls.pixelLength, 'Back')}
                    {createBox(props.controls.pixelWidth / 2)}
                  </div>

                  <div
                    className='flex items-center'
                    style={{
                      height: `${
                        (props.controls.pixelWidth * scaleFactor) / 2
                      }px`,
                    }}
                  >
                    {createBox(props.controls.pixelWidth, 'Bottom cover')}
                    {createBox(props.controls.pixelLength, 'Bottom cover')}
                    {createBox(props.controls.pixelWidth, 'Bottom cover')}
                    {createBox(props.controls.pixelLength, 'Bottom cover')}
                  </div>
                </section>
              </div>
            </div>
          </motion.div>,
          document.body
        )}
    </>
  )
}
