'use client'

import { createPortal } from 'react-dom'
import useBoxControls from './useBoxControls'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { cn, computePrice, getPricePerInch } from '@/lib/utils'
import { SlidingNumber } from '@/components/ui/sliding-number'
import { ReactNode, useState } from 'react'
import { useSession } from 'next-auth/react'

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

  const [scaleFactor] = useState(8)

  const session = useSession()

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
              <div className='bg-white shadow rounded p-8 text-black [&_code]:dark:text-white'>
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
                      className='dark:text-white'
                    >
                      Single
                    </Button>
                    <Button
                      size={'sm'}
                      variant={
                        props.controls.boxThickness == 2 ? 'outline' : 'ghost'
                      }
                      onClick={() => props.controls.setBoxThickness(2)}
                      className='dark:text-white'
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

                <div className='mb-3 mt-8 ml-8 text-sm'>
                  Unit of Measurement: <code>inch</code>{' '}
                </div>
                <Render2DBox
                  scaleFactor={scaleFactor}
                  width={props.controls.pixelWidth}
                  length={props.controls.pixelLength}
                  height={props.controls.height}
                  thickness={props.controls.boxThickness}
                />

                <div className='mt-4'>
                  <div>
                    For:{' '}
                    <span className='inline-block underline capitalize'>
                      {session.data?.user.name}
                    </span>
                  </div>
                  <div className='text-xs'>{session.data?.user.email}</div>
                </div>
              </div>
            </div>
          </motion.div>,
          document.body
        )}
    </>
  )
}

export function Render2DBox(props: {
  width: number
  length: number
  height: number
  thickness: number
  scaleFactor: number
}) {
  const coverHeight = props.width / 2
  const bodyHeight = props.height
  const total2DHeight = coverHeight * 2 + bodyHeight

  const total2DLength = (props.width + props.length) * 2 + props.width

  return (
    <div className='relative h-auto pl-8 pb-8'>
      <div
        aria-label={'Ruler-y'}
        className='absolute left-8 top-0 bottom-8 w-0.5 bg-neutral-400'
        style={{
          height: `${total2DHeight * props.scaleFactor}px`,
        }}
      >
        {Array.from({ length: total2DHeight + 5 })
          .map((_, i) => i)
          .reverse()
          .map((n) => {
            if (n % 5 !== 0) return null
            return (
              <div
                key={n}
                className='text-xs h-0.5 w-3 bg-neutral-400 absolute bottom-0 -left-3'
                style={{
                  transform: `translateY(-${n * props.scaleFactor}px)`,
                }}
              >
                <span className='absolute -left-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground'>
                  {n}
                </span>
              </div>
            )
          })}
      </div>
      <div
        aria-label={'Ruler-x'}
        className='absolute left-8 bottom-8 h-0.5 bg-neutral-400 flex justify-between'
        style={{
          width: `${
            ((props.width + props.length) * 2 + props.width) * props.scaleFactor
          }px`,
        }}
      >
        {Array.from({ length: total2DLength + 5 }).map((_, n) => {
          if (n % 5 !== 0) return null
          return (
            <div
              key={n}
              className='text-xs w-0.5 bg-neutral-400 h-3 absolute'
              style={{
                transform: `translateX(${n * props.scaleFactor}px)`,
              }}
            >
              <span className='absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground'>
                {n}
              </span>
            </div>
          )
        })}
      </div>

      <section
        style={{
          width: `${
            ((props.width + props.length) * 2 + props.width) * props.scaleFactor
          }px`,
        }}
      >
        <BoxRow2D height={(props.width * props.scaleFactor) / 2}>
          <BoxPortion
            thickness={props.thickness}
            isCover='top'
            scaleFactor={props.scaleFactor}
            width={props.width}
          >
            Top side cover
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.length}
          >
            Top long cover
          </BoxPortion>
          <BoxPortion
            isCover='top'
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.width}
          >
            Top side cover
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.length}
          >
            Top long cover
          </BoxPortion>
        </BoxRow2D>

        <BoxRow2D height={props.height * props.scaleFactor}>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.width}
          >
            <span>Left side</span>
            <pre>
              {props.width}x{props.height}
            </pre>
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.length}
          >
            <span>Front</span>
            <pre>
              {props.length}x{props.height}
            </pre>
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.width}
          >
            <span>Right side</span>
            <pre>
              {props.width}x{props.height}
            </pre>
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.length}
          >
            <span>Back</span>
            <pre>
              {props.length}x{props.height}
            </pre>
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.width}
          />
        </BoxRow2D>

        <BoxRow2D height={(props.width * props.scaleFactor) / 2}>
          <BoxPortion
            thickness={props.thickness}
            isCover='bottom'
            scaleFactor={props.scaleFactor}
            width={props.width}
          >
            Bottom cover
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.length}
          >
            Bottom cover
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            isCover='bottom'
            scaleFactor={props.scaleFactor}
            width={props.width}
          >
            Bottom cover
          </BoxPortion>
          <BoxPortion
            thickness={props.thickness}
            scaleFactor={props.scaleFactor}
            width={props.length}
          >
            Bottom cover
          </BoxPortion>
        </BoxRow2D>
      </section>
    </div>
  )
}

function BoxPortion({
  children,
  width,
  scaleFactor,
  isCover,
  thickness,
}: {
  width: number
  children?: ReactNode
  scaleFactor: number
  thickness: number
  isCover?: 'top' | 'bottom'
}) {
  const getClipPath = () => {
    if (isCover === 'top') return 'polygon(3% 0, 97% 0%, 100% 100%, 0% 100%)'
    if (isCover === 'bottom') return 'polygon(0 0, 100% 0%, 97% 100%, 3% 100%)'
    return undefined
  }

  return (
    <div
      className={cn(
        'border h-full text-xs text-center flex flex-col items-center justify-center text-white',
        {
          'drop-shadow-md': thickness === 2,
        }
      )}
      style={{
        width: `${width * scaleFactor}px`,
        backgroundImage: 'url(/karton.avif)',
        clipPath: getClipPath(),
      }}
    >
      {children}
    </div>
  )
}

function BoxRow2D({
  children,
  height,
}: {
  children: ReactNode
  height: number
}) {
  return (
    <div
      className='flex'
      style={{
        height: `${height}px`,
      }}
    >
      {children}
    </div>
  )
}
