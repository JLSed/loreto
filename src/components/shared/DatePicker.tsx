"use client"

import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { useState } from "react"

export function DatePicker(props: {
  defaultDate?: Date;
  label?: string;
  onSelect?: (date: Date | undefined) => void;
  triggerClassName?: string;
}) {
  const [date, setDate] = useState<Date | undefined>(props.defaultDate)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start text-left font-normal max-w-full w-full",
            !props.defaultDate && "text-muted-foreground",
            props.triggerClassName
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {props.defaultDate ? format(props.defaultDate, "PPP") : <span>{props.label ?? 'Pick a date'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
