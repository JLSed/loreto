'use client'

import { useRef, useState } from 'react'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import Moveable from 'react-moveable'
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from 'react-zoom-pan-pinch'
import { Button } from '@/components/ui/button'
import { ZoomInIcon, ZoomOutIcon } from '@radix-ui/react-icons'

export default function CustomBox() {
  const entireBoxRef = useRef<HTMLDivElement>(null)
  const [transforming, setTransforming] = useState(false)

  return (
    <div>
      <TransformWrapper
        smooth
        pinch={{ step: 5 }}
        initialScale={1}
        minScale={1}
        maxScale={5}
        disabled={transforming}
        limitToBounds={false}
        disablePadding
        centerOnInit
        centerZoomedOut
        wheel={{ step: 50 }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <>
            <Controls />
            <TransformComponent
              contentClass='absolute cursor-move bg-red-200 transform__content'
              wrapperStyle={{
                width: '100%',
                height: '100vh',
                cursor: 'grab',
                backgroundSize: '40px 40px',
                backgroundImage:
                  ' linear-gradient(to right, lightgrey 1px, transparent 1px), linear-gradient(to bottom, lightgrey 1px, transparent 1px)',
              }}
            >
              <div
                ref={entireBoxRef}
                style={{
                  width: '600px',
                  height: '400px',
                  maxWidth: 'auto',
                  maxHeight: 'auto',
                }}
                className='m-auto'
              >
                <ResizablePanelGroup direction='horizontal'>
                  <ResizablePanel
                    defaultSize={40}
                    className='bg-center bg-cover'
                    style={{ backgroundImage: `url(${karton})` }}
                  />
                  <ResizableHandle
                    onMouseDown={() => setTransforming(true)}
                    onMouseUp={() => setTransforming(false)}
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
                target={entireBoxRef}
                resizable
                keepRatio={false}
                throttleResize={1}
                renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
                origin={false}
                onResize={(e) => {
                  e.target.style.width = `${e.width}px`
                  e.target.style.height = `${e.height}px`
                  e.target.style.transform = e.drag.transform
                }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  )
}

const Controls = () => {
  const { zoomIn, zoomOut, centerView, resetTransform } = useControls()
  return (
    <div className='flex items-center gap-1 p-4 absolute right-0 top-0 z-10'>
      <Button
        onClick={() => zoomIn()}
        variant={'secondary'}
        size={'icon'}
      >
        <ZoomInIcon />
      </Button>
      <Button
        onClick={() => zoomOut()}
        variant={'secondary'}
        size={'icon'}
      >
        <ZoomOutIcon />
      </Button>
      <Button
        onClick={() => centerView()}
        variant={'secondary'}
      >
        Center
      </Button>
      <Button
        onClick={() => resetTransform()}
        variant={'secondary'}
      >
        Reset
      </Button>
    </div>
  )
}

const karton = 'https://img.freepik.com/free-photo/brown-texture_1253-152.jpg'
