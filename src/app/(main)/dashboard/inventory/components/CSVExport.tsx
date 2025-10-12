'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState, useTransition } from 'react'
import { exportInventoryToCSV } from '../inventory-actions'

export function CSVExport() {
  const [isPending, startTransition] = useTransition()

  const handleExport = () => {
    startTransition(async () => {
      try {
        const data = await exportInventoryToCSV()

        if (data.length === 0) {
          alert('No inventory data to export')
          return
        }

        // Convert data to CSV
        const headers = Object.keys(data[0]).join(',')
        const csvContent = [
          headers,
          ...data.map((row: any) =>
            Object.values(row)
              .map((value: any) =>
                typeof value === 'string' && value.includes(',')
                  ? `"${value}"`
                  : value
              )
              .join(',')
          ),
        ].join('\n')

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')

        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute(
            'download',
            `box_inventory_${new Date().toISOString().split('T')[0]}.csv`
          )
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Export failed:', error)
        alert('Failed to export inventory data')
      }
    })
  }

  return (
    <Button
      variant='outline'
      onClick={handleExport}
      disabled={isPending}
    >
      <Download className='h-4 w-4 mr-2' />
      {isPending ? 'Exporting...' : 'Export CSV'}
    </Button>
  )
}
