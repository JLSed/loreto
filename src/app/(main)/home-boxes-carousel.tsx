'use client'

import Box1 from '@/assets/images/box1.jpeg'
import Box2 from '@/assets/images/box2.jpeg'
import Box3 from '@/assets/images/box3_inside.jpeg'
import Box4 from '@/assets/images/box3_top.jpeg'
import Box5 from '@/assets/images/box3.jpeg'
import Box6 from '@/assets/images/box3_inside2.jpeg'

const boxes = [Box1, Box2, Box3, Box4, Box5, Box6]

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import React from 'react'
import Image from 'next/image'

export default function HomeBoxesCarousel() {
  return (
    <section className='my-24 space-y-8'>
      <h2>Sample Boxes</h2>

      <Carousel opts={{ dragFree: true }}>
        <CarouselContent className='gap-8'>
          {boxes.map((b) => (
            <CarouselItem
              key={b.src}
              className='basis-1/3'
            >
              <Image
                alt=''
                src={b}
                className={'aspect-square object-cover rounded object-bottom'}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
