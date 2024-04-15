/* eslint-disable @next/next/no-img-element */
'use client'

import { Button } from '@/components/ui/button'
import { Box, BoxMarking, ImageMarking, User } from '@prisma/client'
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  user: User
  box: Box & {
    markings: BoxMarking[]
    imageMarkings: ImageMarking[]
  }
}

export default function AddToCartComponent(props: Props) {
  const router = useRouter()

  return (
    <div className='p-4'>
      <nav className='flex items-center gap-2'>
        <Button
          size={'icon'}
          variant={'ghost'}
          onClick={() => router.back()}
        >
          <ArrowLeftIcon />
        </Button>
        <h4>Add this box to your cart</h4>
      </nav>

      <div className='mt-8'>
        <div
          aria-label='box'
          style={{
            backgroundImage: 'url("/karton.avif")',
            width: props.box.totalWidth + 'px',
            height: props.box.height + 'px',
            display: 'grid',
            gridTemplateColumns: `${props.box.leftPanelSize}% 1fr ${props.box.rightPanelSize}%`,
          }}
          className='relative'
        >
          <div className='border-r'></div>
          <div></div>
          {props.box.markings.map((m, i) => {
            return (
              <div
                key={i}
                className='p-2 inline-block absolute text-black'
                style={{
                  transform: m.cssTransform.trim(),
                }}
              >
                {m.label} {m.value}
              </div>
            )
          })}

          {props.box.imageMarkings.map((m, i) => {
            return (
              <div
                key={i}
                className='cursor-move inline-block absolute z-10 text-black'
                style={{
                  transform: m.transform,
                  width: `${m.width}px`,
                  height: `${m.height}px`,
                }}
              >
                <img
                  className='grayscale'
                  src={m.src}
                  alt=''
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
