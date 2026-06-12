 
'use client'

import { RefObject, useRef, useState } from 'react'

import Moveable from 'react-moveable'
import { flushSync } from 'react-dom'
import useBoxControls, {
  LSKeys,
  LocalImageMarking,
} from '@/app/(main)/box/useBoxControls'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

import ImageUpload from '../shared/ImageUpload'
import Image from 'next/image'

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  controls: ReturnType<typeof useBoxControls>
  marking: LocalImageMarking
  onMouseDown: () => void
  onMouseUp: () => void
}

export default function ImageMarking(props: Props) {
  const targetRef = useRef<HTMLDivElement>(null)

  const [src, setSrc] = useState(props.marking.imageSrc)
  const [targetted, setTargetted] = useState(false)
  const [resizable, setResizable] = useState(false)

  return (
    <>
      <ContextMenu
        onOpenChange={(open) => {
          if (!open) props.onMouseUp()
          props.controls.setHideControls(open)
        }}
      >
        <ContextMenuTrigger asChild>
          <div
            onMouseEnter={() => setTargetted(true)}
            onMouseLeave={() => setTargetted(false)}
            onMouseDown={props.onMouseDown}
            onMouseOver={() => setTargetted(true)}
            onClick={() => setResizable((r) => !r)}
            onMouseUp={() => {
              props.onMouseUp()
              const markings = localStorage.getItem(LSKeys.IMAGE_MARKINGS)
              if (markings) {
                const parsed = JSON.parse(markings) as LocalImageMarking[]
                props.controls.setImageMarkings(parsed)
              }
            }}
            ref={targetRef}
            className='cursor-move absolute z-10 text-black grid place-items-center'
            style={{
              transform: props.marking.transform,
              width: `${props.marking.width * props.controls.SCALE_FACTOR}px`,
              height: `${props.marking.height * props.controls.SCALE_FACTOR}px`,
            }}
          >
            <Image
              fill
              className='grayscale'
              src={src}
              alt=''
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className='rounded-xl w-[200px]'>
          <ImageUpload
            onImageChange={({ imageSrc }) => {
              imageSrc && setSrc(imageSrc)
              const markings = localStorage.getItem(LSKeys.IMAGE_MARKINGS)
              if (markings && imageSrc) {
                const parsed = JSON.parse(markings) as LocalImageMarking[]
                const index = parsed.findIndex((m) => m.id === props.marking.id)
                parsed[index].imageSrc = imageSrc

                localStorage.setItem(
                  LSKeys.IMAGE_MARKINGS,
                  JSON.stringify(parsed)
                )
                props.controls.setImageMarkings(parsed)
              }
            }}
            hideReset
            inputName={''}
            initialImageSrc={src}
          />
          {/* <div className='mt-1'>
            <Button
              className='w-full'
              variant={'secondary'}
            >
              Remove this image
            </Button>
          </div> */}
        </ContextMenuContent>
      </ContextMenu>

      <Moveable
        draggable
        keepRatio
        resizable={resizable && !props.controls.isSaving}
        hideDefaultLines={!targetted || props.controls.isSaving}
        flushSync={flushSync}
        target={targetRef.current}
        origin={false}
        renderDirections={['nw', 'ne', 'sw', 'se']}
        onResize={(e) => {
          e.target.style.width = `${e.width}px`
          e.target.style.height = `${e.height}px`
          e.target.style.transform = e.drag.transform
        }}
        onResizeEnd={(e) => {
          const target = e.target as HTMLElement
          const transform = target.style.transform
          const width =
            parseFloat(target.style.width) / props.controls.SCALE_FACTOR
          const height =
            parseFloat(target.style.height) / props.controls.SCALE_FACTOR

          const markings = localStorage.getItem(LSKeys.IMAGE_MARKINGS)
          if (markings) {
            const parsed = JSON.parse(markings) as LocalImageMarking[]
            const index = parsed.findIndex((m) => m.id === props.marking.id)
            if (index !== -1) {
              parsed[index].transform = transform.trim()
              parsed[index].width = width
              parsed[index].height = height
              localStorage.setItem(
                LSKeys.IMAGE_MARKINGS,
                JSON.stringify(parsed)
              )
              props.controls.setImageMarkings(parsed)
            }
          }
        }}
        onDrag={(e) => {
          e.target.style.transform = e.transform
        }}
        onDragEnd={(e) => {
          const transform = e.target.style.transform
          const markings = localStorage.getItem(LSKeys.IMAGE_MARKINGS)
          if (markings) {
            const parsed = JSON.parse(markings) as LocalImageMarking[]
            const index = parsed.findIndex((m) => m.id === props.marking.id)
            if (index !== -1) {
              parsed[index].transform = transform.trim()
              localStorage.setItem(
                LSKeys.IMAGE_MARKINGS,
                JSON.stringify(parsed)
              )
              props.controls.setImageMarkings(parsed)
            }
          }
        }}
      />
    </>
  )
}
