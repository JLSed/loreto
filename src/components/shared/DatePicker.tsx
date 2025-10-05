'use client'

import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export function DatePicker(props: {
  defaultDate?: Date
  label?: string
  onSelect?: (date: Date | undefined) => void
  triggerClassName?: string
  disabled?: boolean
  minDate?: Date
}) {
  const [date, setDate] = useState<Date | undefined>(props.defaultDate)

  const handleSelect = (selected: Date | undefined) => {
    setDate(selected)
    if (props.onSelect) {
      props.onSelect(selected)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal max-w-full w-full',
            !date && 'text-muted-foreground',
            props.triggerClassName
          )}
          disabled={props.disabled}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            format(date, 'PPP')
          ) : (
            <span>{props.label ?? 'Pick a date'}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-auto p-0'
        align='start'
        style={{
          pointerEvents: props.disabled ? 'none' : undefined,
          opacity: props.disabled ? 0.5 : 1,
        }}
      >
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleSelect}
          initialFocus
          disabled={props.disabled}
          fromDate={props.minDate}
        />
      </PopoverContent>
    </Popover>
  )
}
