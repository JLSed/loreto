'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState, useTransition, useEffect } from 'react'
import { createBoxInventoryEntry, getBoxTypes } from '../inventory-actions'

interface BoxType {
  id: number
  typeName: string
}

interface AddBoxEntryFormProps {
  onClose: () => void
}

export function AddBoxEntryForm({ onClose }: AddBoxEntryFormProps) {
  const [formData, setFormData] = useState({
    length: 0,
    width: 0,
    height: 0,
    thickness: 0,
    color: 0,
    quantity: 1,
    weightPerPiece: 0,
    cardboardType: 0,
    boxType: 0,
  })
  const [boxTypes, setBoxTypes] = useState<BoxType[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    // Load box types
    getBoxTypes().then(setBoxTypes)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.boxType) {
      alert('Please select a box type')
      return
    }

    startTransition(async () => {
      const result = await createBoxInventoryEntry(formData)
      if (result.success) {
        alert('Box entry created successfully')
        onClose()
      } else {
        alert(result.error || 'Failed to create box entry')
      }
    })
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? parseInt(value) || 0 : value,
    }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4'
    >
      <div className='grid grid-cols-3 gap-4'>
        <div>
          <Label htmlFor='length'>Length</Label>
          <Input
            id='length'
            type='number'
            min='1'
            value={formData.length || ''}
            onChange={(e) => handleInputChange('length', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor='width'>Width</Label>
          <Input
            id='width'
            type='number'
            min='1'
            value={formData.width || ''}
            onChange={(e) => handleInputChange('width', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor='height'>Height</Label>
          <Input
            id='height'
            type='number'
            min='1'
            value={formData.height || ''}
            onChange={(e) => handleInputChange('height', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label>Thickness</Label>
        <Select
          value={formData.thickness.toString()}
          onValueChange={(value) => handleInputChange('thickness', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='0'>Single</SelectItem>
            <SelectItem value='1'>Double</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label>Box Type</Label>
          <Select
            value={formData.boxType.toString()}
            onValueChange={(value) => handleInputChange('boxType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select box type' />
            </SelectTrigger>
            <SelectContent>
              {boxTypes.map((type) => (
                <SelectItem
                  key={type.id}
                  value={type.id.toString()}
                >
                  {type.typeName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Color</Label>
          <Select
            value={formData.color.toString()}
            onValueChange={(value) => handleInputChange('color', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='0'>White</SelectItem>
              <SelectItem value='1'>Yellow</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Cardboard Type</Label>
        <Select
          value={formData.cardboardType.toString()}
          onValueChange={(value) => handleInputChange('cardboardType', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='0'>Brand New</SelectItem>
            <SelectItem value='1'>Second Hand</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='quantity'>Quantity</Label>
          <Input
            id='quantity'
            type='number'
            min='1'
            value={formData.quantity || ''}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor='weightPerPiece'>Weight per Piece (lbs)</Label>
          <Input
            id='weightPerPiece'
            type='number'
            min='0'
            step='0.1'
            value={formData.weightPerPiece || ''}
            onChange={(e) =>
              handleInputChange('weightPerPiece', e.target.value)
            }
            required
          />
        </div>
      </div>

      <div className='bg-muted p-3 rounded-md'>
        <p className='text-sm text-muted-foreground'>
          Total Weight:{' '}
          <strong>
            {(formData.quantity * formData.weightPerPiece).toFixed(1)} lbs
          </strong>
        </p>
      </div>

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
          type='submit'
          disabled={isPending || !formData.boxType}
        >
          {isPending ? 'Creating...' : 'Create Entry'}
        </Button>
      </div>
    </form>
  )
}
