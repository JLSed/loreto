import { ReactNode, useRef } from 'react'
import useBoxControls, { LocalMarking } from './useBoxControls'
import Moveable from 'react-moveable'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import BoxMarking from '@/components/moveable/BoxMarking'
import { cn } from '@/lib/utils'

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
          width: `${props.controls.containerWidth}px`,
          height: `${props.controls.height}px`,
          maxWidth: 'auto',
          maxHeight: 'auto',
          transform: props.controls.dragTransform,
        }}
        id='main-container'
        className={cn('m-auto relative', {
          hidden:
            props.controls.containerWidth === 0 || props.controls.height === 0,
        })}
      >
        <ResizablePanelGroup direction='horizontal'>
          {props.controls.markings.map(renderMarkings)}
          <ResizablePanel
            defaultSize={40}
            className='bg-center'
            style={{ backgroundImage: `url(${karton})` }}
          />
          <ResizableHandle
            onMouseDown={() => (panelResizing.current = true)}
            onMouseUp={() => (panelResizing.current = false)}
            withHandle
          />
          <ResizablePanel
            defaultSize={60}
            className='bg-center'
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
        renderDirections={['n', 'w', 'e', 's']}
        origin={false}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`
          e.target.style.height = `${e.height}px`
          e.target.style.transform = e.drag.transform
          props.controls.setHeight(e.height)
          localStorage.setItem('container__width', e.width.toString())
        }}
        onDrag={(e) => {
          if (panelResizing.current) return
          e.target.style.transform = e.transform

          localStorage.setItem('drag__transform', e.transform)
        }}
      />
    </div>
  )
}

const karton = 'https://img.freepik.com/free-photo/brown-texture_1253-152.jpg'
