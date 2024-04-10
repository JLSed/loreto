import { ReactNode, useEffect, useRef } from 'react'
import useBoxControls, {
  LSKeys,
  LocalImageMarking,
  LocalMarking,
} from './useBoxControls'
import Moveable from 'react-moveable'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import BoxMarking from '@/components/moveable/BoxMarking'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { motion } from 'framer-motion'
import ImageMarking from '@/components/moveable/ImageMarking'

export default function Panels(props: {
  controls: ReturnType<typeof useBoxControls>
}) {
  const entireBoxRef = useRef<HTMLDivElement>(null)
  const panelResizing = useRef(false)

  // panel refs
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)

  useEffect(() => {
    leftPanelRef.current?.resize(props.controls.leftPanelSize)
    rightPanelRef.current?.resize(props.controls.rightPanelSize)
  }, [props.controls.leftPanelSize, props.controls.rightPanelSize])

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

  function renderImageMarkings(
    mark: LocalImageMarking,
    index: number
  ): ReactNode {
    return (
      <ImageMarking
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={entireBoxRef}
        style={{
          width: `${props.controls.containerWidth}px`,
          height: `${props.controls.height}px`,
          maxWidth: 'auto',
          maxHeight: 'auto',
          transform: props.controls.dragTransform,
        }}
        id='main-container'
        className={'m-auto relative cursor-grab'}
      >
        <ResizablePanelGroup direction='horizontal'>
          {props.controls.markings.map(renderMarkings)}
          {props.controls.imageMarkings.map(renderImageMarkings)}

          <ResizablePanel
            ref={leftPanelRef}
            defaultSize={40}
            className='bg-center'
            style={{ backgroundImage: `url(${karton})` }}
            onResize={(e) => {
              if (e === 40) return
              localStorage.setItem(LSKeys.LEFT_PANEL_SIZE, e.toString())
              props.controls.setLeftPanelSize(e)
            }}
          />
          <ResizableHandle
            onMouseDown={() => (panelResizing.current = true)}
            onMouseUp={() => (panelResizing.current = false)}
            withHandle={!props.controls.isSaving}
          />
          <ResizablePanel
            ref={rightPanelRef}
            defaultSize={60}
            className='bg-center'
            style={{ backgroundImage: `url(${karton})` }}
            onResize={(e) => {
              if (e === 60) return
              localStorage.setItem(LSKeys.RIGHT_PANEL_SIZE, e.toString())
              props.controls.setRightPanelSize(e)
            }}
          />
        </ResizablePanelGroup>
      </motion.div>

      <Moveable
        key={props.controls.dimKey}
        hideChildMoveableDefaultLines
        hideDefaultLines
        useAccuratePosition
        target={entireBoxRef}
        resizable={!props.controls.hideControls}
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
          props.controls.setContainerWidth(e.width)
          localStorage.setItem(LSKeys.CONTAINER_WIDTH, e.width.toString())
        }}
        onDrag={(e) => {
          if (panelResizing.current) return
          e.target.style.transform = e.transform
          localStorage.setItem(LSKeys.DRAG_TRANSFORM, e.transform)
        }}
      />
    </div>
  )
}

const karton = '/karton.avif'
