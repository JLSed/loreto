'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus } from 'lucide-react'
import { useState, useTransition } from 'react'
import { createBoxType, deleteBoxType } from '../inventory-actions'
// import { useToast } from '@/components/ui/use-toast'

interface BoxType {
  id: number
  typeName: string
}

interface BoxTypeManagementProps {
  boxTypes: BoxType[]
}

export function BoxTypeManagement({ boxTypes }: BoxTypeManagementProps) {
  const [newTypeName, setNewTypeName] = useState('')
  const [isPending, startTransition] = useTransition()
  // const { toast } = useToast()

  const handleAddType = () => {
    if (!newTypeName.trim()) return

    startTransition(async () => {
      const result = await createBoxType(newTypeName.trim())
      if (result.success) {
        setNewTypeName('')
        alert('Box type created successfully')
      } else {
        alert(result.error || 'Failed to create box type')
      }
    })
  }

  const handleDeleteType = (id: number, typeName: string) => {
    startTransition(async () => {
      const result = await deleteBoxType(id)
      if (result.success) {
        alert('Box type deleted successfully')
      } else {
        alert(result.error || 'Failed to delete box type')
      }
    })
  }

  return (
    <div className='space-y-4'>
      {/* Add new type */}
      <div className='flex gap-2'>
        <Input
          placeholder='New box type name'
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddType()}
          disabled={isPending}
        />
        <Button
          onClick={handleAddType}
          disabled={!newTypeName.trim() || isPending}
          size='sm'
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {/* List existing types */}
      <div className='space-y-2'>
        {boxTypes.length === 0 ? (
          <p className='text-sm text-muted-foreground text-center py-4'>
            No box types yet. Add one above.
          </p>
        ) : (
          boxTypes.map((type) => (
            <div
              key={type.id}
              className='flex items-center justify-between p-3 rounded-lg bg-muted'
            >
              <Badge variant='secondary'>{type.typeName}</Badge>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleDeleteType(type.id, type.typeName)}
                disabled={isPending}
                className='text-destructive hover:text-destructive/80 hover:bg-destructive/10'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
