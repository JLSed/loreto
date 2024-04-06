import useBoxControls from '../useBoxControls'

import Moveable from 'react-moveable'
import { useRef } from 'react'
import { flushSync } from 'react-dom'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function Phase1(props: Props) {
  const targetRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        className='flex items-center justify-center h-full flex-col'
        ref={containerRef}
      >
        <div
          ref={targetRef}
          className='p-2'
        >
          Marking
        </div>
      </div>

      <Moveable
        draggable
        flushSync={flushSync}
        target={targetRef.current}
        // container={containerRef.current}
        onDrag={(e) => {
          e.target.style.transform = e.transform
        }}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`
          e.target.style.height = `${e.height}px`
        }}
      />
    </>
  )
}
