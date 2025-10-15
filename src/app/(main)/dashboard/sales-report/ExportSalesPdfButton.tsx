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
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Export Sales Report</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <Label htmlFor='month'>Select Month</Label>
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

          <div>
            <Label htmlFor='description'>Description (Optional)</Label>
            <Textarea
              id='description'
              placeholder='Add a description for this sales report...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className='flex gap-2 justify-end'>
            <Button
              variant='outline'
              onClick={() => setOpen(false)}
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
