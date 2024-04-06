'use client'

import { RefObject, useRef, useState } from 'react'

import Moveable from 'react-moveable'
import { flushSync } from 'react-dom'

interface Props {
  containerRef: RefObject<HTMLDivElement>
  label: string
  parentWidth: number
  value?: string
  underlined?: boolean
}

export default function BoxMarking(props: Props) {
  const targetRef = useRef<HTMLDivElement>(null)

  const [targetted, setTargetted] = useState(false)

  const localStorageKey = 'transform' + props.label.replaceAll(' ', '__')

  return (
    <>
      <div
        onMouseOver={() => setTargetted(true)}
        onMouseUp={() => setTargetted(false)}
        onMouseLeave={() => setTargetted(false)}
        ref={targetRef}
        className='p-2 cursor-move inline-block'
        style={{
          transform: localStorage.getItem(localStorageKey) || 'translate(0,0)',
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
          localStorage.setItem(localStorageKey, e.transform)
        }}
      />
    </>
  )
}
