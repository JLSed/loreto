'use client'

import dynamic from 'next/dynamic'
import useBoxControls, { LocalMarking } from '../useBoxControls'

import { useMemo, useRef } from 'react'

const BoxMarking = dynamic(() => import('@/components/moveable/BoxMarking'), {
  ssr: false,
})

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  const markings = useMemo(
    () => props.controls.markings.filter((m) => m.phase === 1),
    [props.controls.markings]
  )

  const renderMarkings = (m: LocalMarking) => {
    return (
      <BoxMarking
        key={m.label.replaceAll(' ', '-')}
        parentWidth={props.controls.widthPercentage}
        containerRef={containerRef}
        label={m.label}
        value={m.value}
        transform={m.transform}
      />
    )
  }

  return (
    <div
      className='h-full flex-col'
      ref={containerRef}
    >
      {markings.map(renderMarkings)}
    </div>
  )
}
