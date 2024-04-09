import { ReactNode, useRef } from 'react'
import useBoxControls, { LocalMarking } from './useBoxControls'
import Moveable from 'react-moveable'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import BoxMarking from '@/components/moveable/BoxMarking'

export default function Panels(props: {
  controls: ReturnType<typeof useBoxControls>
}) {
  const entireBoxRef = useRef<HTMLDivElement>(null)
  const panelResizing = useRef(false)

  function renderMarkings(mark: LocalMarking, index: number): ReactNode {
    return (
      <BoxMarking
        key={index}
        containerRef={entireBoxRef}
        controls={props.controls}
        marking={mark}
        onMouseDown={() => (panelResizing.current = true)}
        onMouseUp={() => (panelResizing.current = false)}
      />
    )
  }

  return (
    <div className='w-full h-[100vh]'>
      <div
        ref={entireBoxRef}
        style={{
          width: '600px',
          height: `${props.controls.height}px`,
          maxWidth: 'auto',
          maxHeight: 'auto',
        }}
        className='m-auto relative'
      >
        <ResizablePanelGroup direction='horizontal'>
          {props.controls.markings.map(renderMarkings)}
          <ResizablePanel
            defaultSize={40}
            className='bg-center bg-cover'
            style={{ backgroundImage: `url(${karton})` }}
          />
          <ResizableHandle
            onMouseDown={() => (panelResizing.current = true)}
            onMouseUp={() => (panelResizing.current = false)}
            withHandle
          />
          <ResizablePanel
            defaultSize={60}
            className='bg-center rotate-180 bg-cover'
            style={{ backgroundImage: `url(${karton})` }}
          />
        </ResizablePanelGroup>
      </div>

      <Moveable
        key={props.controls.dimKey}
        target={entireBoxRef}
        resizable
        edgeDraggable={false}
        keepRatio={false}
        throttleResize={1}
        draggable
        renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
        origin={false}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`
          e.target.style.height = `${e.height}px`
          e.target.style.transform = e.drag.transform

          props.controls.setHeight(e.height)
        }}
        onDrag={(e) => {
          if (panelResizing.current) return
          e.target.style.transform = e.transform
        }}
      />
    </div>
  )
}

const karton = 'https://img.freepik.com/free-photo/brown-texture_1253-152.jpg'
