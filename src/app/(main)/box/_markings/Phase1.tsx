'use client'

import useBoxControls from '../useBoxControls'

import Moveable from 'react-moveable'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1(props: Props) {
  const targetRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [draggable, setDraggable] = useState(false)
  const [transformationsDone, setTransformationsDone] = useState(false)

  const getTransformFromLocalStorage = () => {
    if (typeof window === 'undefined') return
    return localStorage.getItem('transform')
  }

  useEffect(() => {
    const t = getTransformFromLocalStorage()
    if (targetRef.current && t) {
      targetRef.current.style.transform = t
      setTransformationsDone(true)
    }
  }, [])

  return (
    <>
      <div
        className='flex items-center justify-center h-full flex-col'
        ref={containerRef}
      >
        <div
          hidden={!transformationsDone}
          onMouseOver={() => setDraggable(true)}
          onMouseUp={() => setDraggable(false)}
          ref={targetRef}
          className='p-2 cursor-move'
        >
          Marking
        </div>
      </div>

      <Moveable
        clickable
        key={props.controls.widthPercentage + transformationsDone.toString()}
        draggable={draggable}
        hideDefaultLines={!draggable}
        flushSync={flushSync}
        target={targetRef.current}
        origin={false}
        // container={containerRef.current}
        onDrag={(e) => {
          e.target.style.transform = e.transform
          localStorage.setItem('transform', e.transform)
          console.log(e.transform)
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`
          e.target.style.height = `${e.height}px`
        }}
      />
    </>
  )
}
