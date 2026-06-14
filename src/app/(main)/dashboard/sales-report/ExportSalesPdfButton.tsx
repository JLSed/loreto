'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useState } from 'react'
import { exportSalesReportPDF } from './export-pdf'

interface Transaction {
  createdAt: Date
  amount: number | null
}

interface ExportSalesPdfButtonProps {
  rent: Transaction[]
  box: Transaction[]
  booking: Transaction[]
}

export function ExportSalesPdfButton({ rent, box, booking }: ExportSalesPdfButtonProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')

  // Date range state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState('00:00')
  const [endTime, setEndTime] = useState('23:59')

  // Popover open states
  const [startCalendarOpen, setStartCalendarOpen] = useState(false)
  const [endCalendarOpen, setEndCalendarOpen] = useState(false)

  const isRangeValid = startDate && endDate

  /**
   * Combines a date and a time string into a single Date object.
   */
  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(':').map(Number)
    const combined = new Date(date)
    combined.setHours(hours, minutes, 0, 0)
    return combined
  }

  const handleExport = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates')
      return
    }

    const from = combineDateAndTime(startDate, startTime)
    const to = combineDateAndTime(endDate, endTime)

    if (from > to) {
      alert('Start date/time must be before end date/time')
      return
    }

    // Filter transactions by the selected date and time range
    const filterByDateRange = (transactions: Transaction[]) => {
      return transactions.filter((t) => {
        const txDate = new Date(t.createdAt)
        return txDate >= from && txDate <= to
      })
    }

    const filteredRent = filterByDateRange(rent)
    const filteredBox = filterByDateRange(box)
    const filteredBooking = filterByDateRange(booking)

    const rentTotal = filteredRent.reduce((sum, t) => sum + (t.amount || 0), 0)
    const boxTotal = filteredBox.reduce((sum, t) => sum + (t.amount || 0), 0)
    const bookingTotal = filteredBooking.reduce((sum, t) => sum + (t.amount || 0), 0)
    const total = rentTotal + boxTotal + bookingTotal

    exportSalesReportPDF({
      dateRange: {
        from,
        to,
      },
      description,
      summary: {
        total,
        rent: rentTotal,
        box: boxTotal,
        booking: bookingTotal,
      },
      exportDate: new Date().toLocaleDateString(),
    })

    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setStartTime('00:00')
    setEndTime('23:59')
    setDescription('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button className='mb-4'>Export Sales as PDF</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-destructive/10'>
              <svg
                className='w-5 h-5 text-primary'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <div>
              <DialogTitle className='text-lg font-semibold text-foreground'>
                Export Sales Report
              </DialogTitle>
              <p className='text-sm text-muted-foreground mt-1'>
                Select a date and time range to generate a PDF report
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className='space-y-6 mt-6'>
          {/* Date Range Section */}
          <div className='space-y-4'>
            <Label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
              <svg
                className='w-4 h-4 text-muted-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              Date &amp; Time Range
            </Label>

            {/* Start Date & Time */}
            <div className='grid grid-cols-[1fr_auto] gap-3 items-end'>
              <div className='space-y-1.5'>
                <Label
                  htmlFor='start-date'
                  className='text-xs text-muted-foreground'
                >
                  Start Date
                </Label>
                <Popover
                  open={startCalendarOpen}
                  onOpenChange={setStartCalendarOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id='start-date'
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                    >
                      <svg
                        className='mr-2 h-4 w-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                      {startDate ? format(startDate, 'PPP') : 'Pick start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='start'
                  >
                    <Calendar
                      mode='single'
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date)
                        setStartCalendarOpen(false)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className='space-y-1.5'>
                <Label
                  htmlFor='start-time'
                  className='text-xs text-muted-foreground'
                >
                  Time
                </Label>
                <Input
                  id='start-time'
                  type='time'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className='w-[120px]'
                />
              </div>
            </div>

            {/* Separator arrow */}
            <div className='flex justify-center'>
              <svg
                className='w-5 h-5 text-muted-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 14l-7 7m0 0l-7-7m7 7V3'
                />
              </svg>
            </div>

            {/* End Date & Time */}
            <div className='grid grid-cols-[1fr_auto] gap-3 items-end'>
              <div className='space-y-1.5'>
                <Label
                  htmlFor='end-date'
                  className='text-xs text-muted-foreground'
                >
                  End Date
                </Label>
                <Popover
                  open={endCalendarOpen}
                  onOpenChange={setEndCalendarOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      id='end-date'
                      variant='outline'
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                    >
                      <svg
                        className='mr-2 h-4 w-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                        />
                      </svg>
                      {endDate ? format(endDate, 'PPP') : 'Pick end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='start'
                  >
                    <Calendar
                      mode='single'
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date)
                        setEndCalendarOpen(false)
                      }}
                      initialFocus
                      fromDate={startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className='space-y-1.5'>
                <Label
                  htmlFor='end-time'
                  className='text-xs text-muted-foreground'
                >
                  Time
                </Label>
                <Input
                  id='end-time'
                  type='time'
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className='w-[120px]'
                />
              </div>
            </div>

            {/* Range summary */}
            {isRangeValid && (
              <div className='rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground'>
                <span className='font-medium text-foreground'>Range:</span>{' '}
                {format(combineDateAndTime(startDate, startTime), 'PPP p')}
                {' → '}
                {format(combineDateAndTime(endDate, endTime), 'PPP p')}
              </div>
            )}
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='description'
              className='text-sm font-medium text-muted-foreground flex items-center gap-2'
            >
              <svg
                className='w-4 h-4 text-muted-foreground'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h7'
                />
              </svg>
              Description (Optional)
            </Label>
            <Textarea
              id='description'
              placeholder='Add a description for this sales report...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className='resize-none'
            />
          </div>

          <div className='flex gap-3 justify-end pt-4 border-t border-border'>
            <Button
              variant='outline'
              onClick={() => setOpen(false)}
              className='px-6 hover:bg-muted/10 transition-colors'
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!isRangeValid}
            >
              Export PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
