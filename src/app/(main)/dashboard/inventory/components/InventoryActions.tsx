'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Download, Upload } from 'lucide-react'
import { AddBoxEntryForm } from './AddBoxEntryForm'
import { CSVExport } from './CSVExport'
import { CSVImport } from './CSVImport'
import { useState } from 'react'

export function InventoryActions() {
  const [addBoxOpen, setAddBoxOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)

  return (
    <div className='flex gap-2'>
      {/* Export CSV */}
      <CSVExport />

      {/* Import CSV */}
      <Dialog
        open={importOpen}
        onOpenChange={setImportOpen}
      >
        <DialogTrigger asChild>
          <Button variant='outline'>
            <Upload className='h-4 w-4 mr-2' />
            Import CSV
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Import Inventory Data</DialogTitle>
          </DialogHeader>
          <CSVImport onClose={() => setImportOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Box Entry */}
      <Dialog
        open={addBoxOpen}
        onOpenChange={setAddBoxOpen}
      >
        <DialogTrigger asChild>
          <Button>
            <Plus className='h-4 w-4 mr-2' />
            Add Box Entry
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Add New Box Entry</DialogTitle>
          </DialogHeader>
          <AddBoxEntryForm onClose={() => setAddBoxOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
