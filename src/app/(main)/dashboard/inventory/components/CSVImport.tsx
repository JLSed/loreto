'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText } from 'lucide-react'
import { useState, useTransition } from 'react'
import { importInventoryFromCSV } from '../inventory-actions'

interface CSVImportProps {
  onClose: () => void
}

export function CSVImport({ onClose }: CSVImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [isPending, startTransition] = useTransition()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)

      // Parse CSV preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const lines = text.split('\n').filter((line) => line.trim())

        if (lines.length < 2) {
          alert('CSV file must have at least a header and one data row')
          return
        }

        const headers = lines[0]
          .split(',')
          .map((h) => h.trim().replace(/"/g, ''))
        const dataRows = lines.slice(1).map((line) => {
          const values = line.split(',').map((v) => v.trim().replace(/"/g, ''))
          const row: any = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })

        setPreview(dataRows.slice(0, 3)) // Show first 3 rows as preview
      }

      reader.readAsText(selectedFile)
    }
  }

  const handleImport = () => {
    if (!file) return

    startTransition(async () => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string
          const lines = text.split('\n').filter((line) => line.trim())

          if (lines.length < 2) {
            alert('CSV file must have at least a header and one data row')
            return
          }

          const headers = lines[0]
            .split(',')
            .map((h) => h.trim().replace(/"/g, ''))
          const dataRows = lines.slice(1).map((line) => {
            const values = line
              .split(',')
              .map((v) => v.trim().replace(/"/g, ''))
            const row: any = {}
            headers.forEach((header, index) => {
              row[header] = values[index] || ''
            })

            // Convert to expected format
            return {
              length: parseInt(row.length) || 0,
              width: parseInt(row.width) || 0,
              height: parseInt(row.height) || 0,
              thickness: row.thickness || 'Single',
              color: row.color || 'White',
              quantity: parseInt(row.quantity) || 1,
              weightPerPiece: parseFloat(row.weightPerPiece) || 0,
              cardboardType: row.cardboardType || 'Brand New',
              boxType: row.boxType || 'Standard',
            }
          })

          const result = await importInventoryFromCSV(dataRows)

          if (result.success) {
            const successful =
              result.results?.filter((r: any) => r.success).length || 0
            const failed =
              result.results?.filter((r: any) => !r.success).length || 0

            alert(
              `Import completed! ${successful} entries imported successfully. ${failed} failed.`
            )
            onClose()
          } else {
            alert(result.error || 'Failed to import CSV data')
          }
        } catch (error) {
          console.error('Import error:', error)
          alert('Failed to process CSV file')
        }
      }

      reader.readAsText(file)
    })
  }

  const downloadTemplate = () => {
    const template = [
      'length,width,height,thickness,color,quantity,weightPerPiece,cardboardType,boxType',
      '12,8,6,Single,White,50,2.5,Brand New,Standard',
      '10,10,8,Double,Yellow,25,3.0,Second Hand,Heavy Duty',
    ].join('\n')

    const blob = new Blob([template], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'box_inventory_template.csv'
    link.click()
  }

  return (
    <div className='space-y-4'>
      <div className='border rounded-md p-4 bg-accent/10 border-accent/20'>
        <div className='flex items-start gap-2'>
          <FileText className='h-4 w-4 text-accent mt-0.5' />
          <div className='text-sm text-accent'>
            Upload a CSV file with columns: length, width, height, thickness
            (Single/Double), color, quantity, weightPerPiece, cardboardType,
            boxType.
            <br />
            <Button
              variant='link'
              className='p-0 h-auto text-accent'
              onClick={downloadTemplate}
            >
              Download template file
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor='csvFile'>Choose CSV File</Label>
        <Input
          id='csvFile'
          type='file'
          accept='.csv'
          onChange={handleFileChange}
          disabled={isPending}
        />
      </div>

      {preview.length > 0 && (
        <div className='space-y-2'>
          <Label>Preview (first 3 rows):</Label>
          <div className='border rounded-md p-3 bg-muted max-h-32 overflow-auto'>
            <pre className='text-xs'>
              {preview.map((row, index) => (
                <div key={index}>{JSON.stringify(row, null, 2)}</div>
              ))}
            </pre>
          </div>
        </div>
      )}

      <div className='flex gap-2 justify-end'>
        <Button
          type='button'
          variant='outline'
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={!file || isPending}
        >
          <Upload className='h-4 w-4 mr-2' />
          {isPending ? 'Importing...' : 'Import CSV'}
        </Button>
      </div>
    </div>
  )
}
