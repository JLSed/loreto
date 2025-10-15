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
    <div className='w-full h-[100vh] overflow-auto'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={entireBoxRef}
        style={{
          width: `${
            props.controls.containerWidth * props.controls.SCALE_FACTOR
          }px`,
          height: `${props.controls.height * props.controls.SCALE_FACTOR}px`,
          transform: props.controls.dragTransform,
        }}
        id='main-container'
        className={
          'm-auto relative cursor-grab overflow-hidden max-w-[calc(100vw-40px)] lg:max-w-[calc(100vw-320px)] max-h-full'
        }
      >
        <ResizablePanelGroup direction='horizontal'>
          {props.controls.markings.map(renderMarkings)}
          {props.controls.imageMarkings.map(renderImageMarkings)}

          <div
            className='absolute top-[-2rem] grid left-0 right-0'
            style={{
              gridTemplateColumns: `${props.controls.leftPanelSize}% ${props.controls.rightPanelSize}%`,
            }}
          >
            <div className='text-center'>
              W - {props.controls.pixelWidth}
              <code>in</code>
            </div>
            <div className='text-center'>
              L - {props.controls.pixelLength}
              <code>in</code>
            </div>
          </div>
          <div className='left-[-7rem] absolute top-0 bottom-0 grid place-items-center'>
            <span>
              H - {props.controls.height}
              <code>in</code>
            </span>
          </div>

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
          ></ResizablePanel>
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
        draggable
        renderDirections={['n', 'w', 'e', 's']}
        origin={false}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`
          e.target.style.height = `${e.height}px`
          e.target.style.transform = e.drag.transform

          const downScaledHeight = e.height / props.controls.SCALE_FACTOR
          const downScaledWidth = e.width / props.controls.SCALE_FACTOR

          props.controls.setHeight(Math.round(downScaledHeight))
          props.controls.setContainerWidth(Math.round(downScaledWidth))
          localStorage.setItem(
            LSKeys.CONTAINER_WIDTH,
            Math.round(downScaledWidth).toString()
          )
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
