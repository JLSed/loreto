'use client'

import { ReactNode, useEffect, useState } from 'react'
import { BoxDetails } from './page'
import Image from 'next/image'
import { adjustTranslateY, cn, computePrice, pesos } from '@/lib/utils'
import { Box, BoxMarking, ImageMarking } from '@prisma/client'
import { Replace } from 'lucide-react'

interface Props {
  box: Box
  markings: BoxMarking[]
  imageMarkings: ImageMarking[]
  rootClassName?: string
  scaleFactor?: number
}

export default function BoxPreview({
  box,
  rootClassName,
  markings,
  imageMarkings,
}: // scaleFactor = 20,
Props) {
  const [scaleFactor, setscaleFactor] = useState(0)
  useEffect(() => {
    setscaleFactor(window.innerWidth * 0.01)
  }, [])
  const leftWidth = box.totalWidth * (box.leftPanelSize / 100)
  const rightWidth = box.totalWidth * (box.rightPanelSize / 100)
  const coverHeight = leftWidth / 2

  const shortCoverLabel = `Top Side Cover (W: ${leftWidth.toFixed(
    0
  )} x H: ${coverHeight.toFixed(0)})`
  const longCoverLabel = `Top Long Cover (W: ${rightWidth.toFixed(
    0
  )} x H: ${coverHeight.toFixed(0)})`

  return (
    <div className='scale-90 h-full'>
      <div className='mb-2'>
        <div>Note: Hover to see the dimension of each portion.</div>
        <div>
          Cost:{' '}
          {pesos(
            computePrice({
              width: leftWidth,
              length: rightWidth,
              height: box.height,
              thickness: box.thickness === 1 ? 'single' : 'double',
            }).totalPrice
          )}{' '}
          - Thickness: {box.thickness === 1 ? 'Single' : 'Double'}
        </div>
      </div>
      <div
        className={cn(
          'w-screen h-[95vh] overflow-scroll space-y-0.5',
          rootClassName
        )}
      >
        <div className='flex gap-0.5 flex-nowrap w-max'>
          <Rectangle
            width={leftWidth}
            height={coverHeight}
            label={shortCoverLabel}
            scaleFactor={scaleFactor}
          />

          <Rectangle
            width={rightWidth}
            height={coverHeight}
            label={longCoverLabel}
            scaleFactor={scaleFactor}
          />
          <Rectangle
            width={leftWidth}
            height={coverHeight}
            label={shortCoverLabel}
            scaleFactor={scaleFactor}
          />
          <Rectangle
            width={rightWidth}
            height={coverHeight}
            label={longCoverLabel}
            scaleFactor={scaleFactor}
          />
        </div>

        <div className='flex gap-0.5 flex-nowrap w-max'>
          <Rectangle
            scaleFactor={scaleFactor}
            noBackground
            width={box.totalWidth}
            height={box.height}
            className='flex gap-0.5 flex-nowrap relative'
            nonGroup
          >
            {imageMarkings.map((mark, index) => {
              return (
                <Image
                  key={index}
                  src={mark.src}
                  alt=''
                  width={mark.width * scaleFactor}
                  height={mark.height * scaleFactor}
                  className='absolute grayscale z-20'
                  style={{
                    transform: mark.transform,
                  }}
                />
              )
            })}
            {markings.map((mark) => {
              return (
                <div
                  className='absolute z-20 ml-2'
                  key={mark.id}
                  style={{
                    transform: mark.cssTransform,
                  }}
                >
                  {mark.label}: {mark.value}
                </div>
              )
            })}

            <Rectangle
              width={leftWidth}
              height={box.height}
              label={`Left Side: (W: ${leftWidth.toFixed(
                0
              )}) x H: ${box.height.toFixed(0)}`}
              scaleFactor={scaleFactor}
            />
            <Rectangle
              width={rightWidth}
              height={box.height}
              label={`Front: (W: ${rightWidth.toFixed(
                0
              )}) x H: ${box.height.toFixed(0)}`}
              scaleFactor={scaleFactor}
            />
          </Rectangle>
          <Rectangle
            width={leftWidth}
            height={box.height}
            scaleFactor={scaleFactor}
            label={`Right Side: (W: ${rightWidth.toFixed(
              0
            )}) x H: ${box.height.toFixed(0)}`}
          />
          <Rectangle
            width={rightWidth}
            height={box.height}
            scaleFactor={scaleFactor}
            label={`Back: (W: ${leftWidth.toFixed(
              0
            )}) x H: ${box.height.toFixed(0)}`}
          />
          <Rectangle
            width={leftWidth * 0.8}
            height={box.height}
            scaleFactor={scaleFactor}
            label='Connector'
          />
        </div>

        <div className='flex gap-0.5 flex-nowrap w-max'>
          <Rectangle
            width={leftWidth}
            height={coverHeight}
            label={shortCoverLabel.replace('Top', 'Bottom')}
            scaleFactor={scaleFactor}
          />
          <Rectangle
            width={rightWidth}
            height={coverHeight}
            label={longCoverLabel.replace('Top', 'Bottom')}
            scaleFactor={scaleFactor}
          />
          <Rectangle
            width={leftWidth}
            height={coverHeight}
            label={shortCoverLabel.replace('Top', 'Bottom')}
            scaleFactor={scaleFactor}
          />
          <Rectangle
            width={rightWidth}
            height={coverHeight}
            label={longCoverLabel.replace('Top', 'Bottom')}
            scaleFactor={scaleFactor}
          />
        </div>
      </div>
    </div>
  )
}

const backgroundImage = 'url(/karton.avif)'
const px = (n: number, factor = 20) => `${n * factor}px`

const Rectangle = ({
  width,
  height,
  children,
  noBackground,
  className,
  label,
  nonGroup,
  scaleFactor,
}: {
  width: number
  height: number
  children?: ReactNode
  noBackground?: boolean
  nonGroup?: boolean
  className?: string
  label?: ReactNode
  scaleFactor?: number
}) => {
  return (
    <div
      style={{
        backgroundImage: noBackground ? undefined : backgroundImage,
        height: px(height, scaleFactor),
        width: px(width, scaleFactor),
      }}
      className={cn('relative', className, {
        group: !nonGroup,
      })}
    >
      {children}
      {label && (
        <div className='bg-black/70 w-full h-full absolute left-0 top-0 z-30 opacity-0 transition group-hover:opacity-100 grid place-items-center'>
          <div className='text-white'>{label}</div>
        </div>
      )}
    </div>
  )
}
