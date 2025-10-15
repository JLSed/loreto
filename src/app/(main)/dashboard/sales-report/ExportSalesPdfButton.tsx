'use client'

import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { exportSalesReportPDF } from './export-pdf'

interface ExportSalesPdfButtonProps {
  summary: {
    total: number
    rent: number
    box: number
    booking: number
  }
}

export function ExportSalesPdfButton({ summary }: ExportSalesPdfButtonProps) {
  const [open, setOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('')
  const [description, setDescription] = useState('')

  // Generate month options for the current year and previous year
  const generateMonthOptions = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const currentYear = new Date().getFullYear()
    const options = []

    // Add current year months
    for (let i = 0; i < months.length; i++) {
      options.push({
        value: `${months[i]} ${currentYear}`,
        label: `${months[i]} ${currentYear}`,
      })
    }

    // Add previous year months
    for (let i = 0; i < months.length; i++) {
      options.push({
        value: `${months[i]} ${currentYear - 1}`,
        label: `${months[i]} ${currentYear - 1}`,
      })
    }

    return options
  }

  const handleExport = () => {
    if (!selectedMonth) {
      alert('Please select a month')
      return
    }

    exportSalesReportPDF({
      month: selectedMonth,
      description,
      summary,
      exportDate: new Date().toLocaleDateString(),
    })

    setOpen(false)
    setSelectedMonth('')
    setDescription('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className='mb-4'>Export Sales as PDF</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-red-50'>
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
              <DialogTitle className='text-lg font-semibold text-gray-900'>
                Export Sales Report
              </DialogTitle>
              <p className='text-sm text-gray-600 mt-1'>
                Generate a PDF report for the selected month
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className='space-y-6 mt-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='month'
              className='text-sm font-medium text-gray-700 flex items-center gap-2'
            >
              <svg
                className='w-4 h-4 text-gray-500'
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
              Select Month
            </Label>
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger>
                <SelectValue placeholder='Choose a month' />
              </SelectTrigger>
              <SelectContent>
                {generateMonthOptions().map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label
              htmlFor='description'
              className='text-sm font-medium text-gray-700 flex items-center gap-2'
            >
              <svg
                className='w-4 h-4 text-gray-500'
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

          <div className='flex gap-3 justify-end pt-4 border-t border-gray-200'>
            <Button
              variant='outline'
              onClick={() => setOpen(false)}
              className='px-6 hover:bg-gray-50 transition-colors'
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!selectedMonth}
            >
              Export PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
