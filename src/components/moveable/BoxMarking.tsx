'use client'

import { RefObject, useRef, useState } from 'react'

import Moveable from 'react-moveable'
import { flushSync } from 'react-dom'
import useBoxControls, {
  LSKeys,
  LocalMarking,
} from '@/app/(main)/box/useBoxControls'
import { Label } from '@/components/ui/label'

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'

import { Input } from '../ui/input'

interface Props {
  containerRef: RefObject<HTMLDivElement>
  controls: ReturnType<typeof useBoxControls>
  marking: LocalMarking
  onMouseDown: () => void
  onMouseUp: () => void
}

export default function BoxMarking(props: Props) {
  const targetRef = useRef<HTMLDivElement>(null)

  const [targetted, setTargetted] = useState(false)
  const [totalChars, setTotalChars] = useState(0)

  return (
    <>
      <ContextMenu
        onOpenChange={(open) => {
          if (!open) props.onMouseUp()
          setTotalChars(props.marking.label.length + props.marking.value.length)
        }}
      >
        <ContextMenuTrigger asChild>
          <div
            onMouseDown={props.onMouseDown}
            onMouseOver={() => setTargetted(true)}
            onMouseUp={() => {
              props.onMouseUp()
              setTargetted(false)
              const markings = localStorage.getItem(LSKeys.BOX_MARKINGS)
              if (markings) {
                const parsed = JSON.parse(markings) as LocalMarking[]
                props.controls.setMarkings(parsed)
              }
            }}
            onMouseLeave={() => setTargetted(false)}
            ref={targetRef}
            className='p-2 cursor-move inline-block absolute z-10'
            style={{
              transform: props.marking.transform,
            }}
          >
            {props.marking.label} {props.marking.value}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className='rounded-xl'>
          <div className='grid grid-cols-[.3fr_1fr] gap-4 items-center p-4'>
            <Label
              className='text-right'
              htmlFor='edit__marking__label'
            >
              Label
            </Label>
            <Input
              id='edit__marking__label'
              defaultValue={props.marking.label}
              onChange={(e) =>
                props.controls.updateMarkLabel({
                  ...props.marking,
                  label: e.target.value,
                })
              }
            />
            <Label
              htmlFor='edit__marking__value'
              className='text-right'
            >
              Value
            </Label>
            <Input
              id='edit__marking__value'
              defaultValue={props.marking.value}
              onChange={(e) =>
                props.controls.updateMarkValue({
                  ...props.marking,
                  value: e.target.value,
                })
              }
            />
          </div>
        </ContextMenuContent>
      </ContextMenu>

      <Moveable
        key={totalChars}
        draggable
        hideDefaultLines={!targetted}
        flushSync={flushSync}
        target={targetRef.current}
        origin={false}
        onDrag={(e) => {
          e.target.style.transform = e.transform
          const markings = localStorage.getItem(LSKeys.BOX_MARKINGS)
          if (markings) {
            const parsed = JSON.parse(markings) as LocalMarking[]
            const index = parsed.findIndex(
              (m) => m.label === props.marking.label
            )
            parsed[index].transform = e.transform
            localStorage.setItem(LSKeys.BOX_MARKINGS, JSON.stringify(parsed))
          }
        }}
      />
    </>
  )
}
