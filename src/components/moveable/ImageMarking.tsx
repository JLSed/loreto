/* eslint-disable @next/next/no-img-element */
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

interface Props {
  containerRef: RefObject<HTMLDivElement>
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
            }}
            ref={targetRef}
            className='cursor-move inline-block absolute z-10 text-black'
            style={{
              transform: props.marking.transform,
              width: `${props.marking.width}px`,
              height: `${props.marking.height}px`,
            }}
          >
            <img
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

          const markings = localStorage.getItem(LSKeys.IMAGE_MARKINGS)
          if (markings) {
            const parsed = JSON.parse(markings) as LocalImageMarking[]
            const index = parsed.findIndex((m) => m.id === props.marking.id)
            parsed[index].transform = e.drag.transform.trim()
            parsed[index].width = e.width
            parsed[index].height = e.height

            localStorage.setItem(LSKeys.IMAGE_MARKINGS, JSON.stringify(parsed))
          }
        }}
        onDrag={(e) => {
          e.target.style.transform = e.transform
          const markings = localStorage.getItem(LSKeys.IMAGE_MARKINGS)
          if (markings) {
            const parsed = JSON.parse(markings) as LocalImageMarking[]
            const index = parsed.findIndex((m) => m.id === props.marking.id)
            parsed[index].transform = e.transform.trim()

            localStorage.setItem(LSKeys.IMAGE_MARKINGS, JSON.stringify(parsed))
          }
        }}
      />
    </>
  )
}
