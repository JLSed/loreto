'use client'

import dynamic from 'next/dynamic'
import useBoxControls from '../useBoxControls'

import { useRef } from 'react'

const BoxMarking = dynamic(() => import('@/components/moveable/BoxMarking'), {
  ssr: false,
})

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className='h-full flex-col'
      ref={containerRef}
    >
      <BoxMarking
        parentWidth={props.controls.widthPercentage}
        containerRef={containerRef}
        label={'PO#:'}
        value='1312312'
      />
    </div>
  )
}
