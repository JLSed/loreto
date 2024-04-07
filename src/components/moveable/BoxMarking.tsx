'use client'

import { RefObject, useRef, useState } from 'react'

import Moveable from 'react-moveable'
import { flushSync } from 'react-dom'
import { LocalMarking } from '@/app/(main)/box/useBoxControls'

interface Props {
  containerRef: RefObject<HTMLDivElement>
  label: string
  parentWidth: number
  value?: string
  underlined?: boolean
  transform: string
}

export default function BoxMarking(props: Props) {
  const targetRef = useRef<HTMLDivElement>(null)

  const [targetted, setTargetted] = useState(false)

  return (
    <>
      <div
        onMouseOver={() => setTargetted(true)}
        onMouseUp={() => setTargetted(false)}
        onMouseLeave={() => setTargetted(false)}
        ref={targetRef}
        className='p-2 cursor-move inline-block'
        style={{
          transform: props.transform,
        }}
      >
        {props.label} {props.value}
      </div>
      <Moveable
        key={props.parentWidth}
        draggable
        hideDefaultLines={!targetted}
        flushSync={flushSync}
        target={targetRef.current}
        origin={false}
        onDrag={(e) => {
          e.target.style.transform = e.transform
          const markings = localStorage.getItem('box-markings')
          if (markings) {
            const parsed = JSON.parse(markings) as LocalMarking[]
            const index = parsed.findIndex((m) => m.label === props.label)
            parsed[index].transform = e.transform
            localStorage.setItem('box-markings', JSON.stringify(parsed))
          }
        }}
      />
    </>
  )
}
