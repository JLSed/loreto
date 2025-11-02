'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Save, X } from 'lucide-react'
import { useState, useTransition } from 'react'
import {
  updateBoxInventoryEntry,
  deleteBoxInventoryEntry,
} from '../inventory-actions'

interface BoxType {
  id: number
  typeName: string
}

interface BoxInventoryEntry {
  id: string
  length: number
  width: number
  height: number
  thickness: number
  color: number
  quantity: number
  weightPerPiece: number
  TotalWeight: number
  cardboardType: number
  type: BoxType
}

interface InventoryTableProps {
  data: BoxInventoryEntry[]
  boxTypes: BoxType[]
}

export function InventoryTable({ data, boxTypes }: InventoryTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<{
    quantity: number
    weightPerPiece: number
  }>({ quantity: 0, weightPerPiece: 0 })
  const [isPending, startTransition] = useTransition()

  const getColorLabel = (color: number) => (color === 0 ? 'White' : 'Yellow')
  const getCardboardTypeLabel = (type: number) =>
    type === 0 ? 'Brand New' : 'Second Hand'
  const getThicknessLabel = (thickness: number) =>
    thickness === 0 ? 'Single' : 'Double'

  const handleEdit = (entry: BoxInventoryEntry) => {
    setEditingId(entry.id)
    setEditValues({
      quantity: entry.quantity,
      weightPerPiece: entry.weightPerPiece,
    })
  }

  const handleSave = (id: string) => {
    startTransition(async () => {
      const result = await updateBoxInventoryEntry(id, editValues)
      if (result.success) {
        setEditingId(null)
        alert('Box entry updated successfully')
      } else {
        alert(result.error || 'Failed to update box entry')
      }
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({ quantity: 0, weightPerPiece: 0 })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this box entry?')) return

    startTransition(async () => {
      const result = await deleteBoxInventoryEntry(id)
      if (result.success) {
        alert('Box entry deleted successfully')
      } else {
        alert(result.error || 'Failed to delete box entry')
      }
    })
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dimensions</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Cardboard</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Weight/Piece</TableHead>
            <TableHead>Total Weight</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className='text-center py-6 text-muted-foreground'
              >
                No inventory entries found. Add some boxes above.
              </TableCell>
            </TableRow>
          ) : (
            data.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className='font-mono text-sm'>
                    {entry.length} × {entry.width} × {entry.height}
                    <div className='text-xs text-muted-foreground'>
                      {getThicknessLabel(entry.thickness)} Wall
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant='outline'>{entry.type.typeName}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={entry.color === 0 ? 'secondary' : 'default'}>
                    {getColorLabel(entry.color)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      entry.cardboardType === 0 ? 'default' : 'secondary'
                    }
                  >
                    {getCardboardTypeLabel(entry.cardboardType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {editingId === entry.id ? (
                    <Input
                      type='number'
                      value={editValues.quantity}
                      onChange={(e) =>
                        setEditValues({
                          ...editValues,
                          quantity: parseInt(e.target.value) || 0,
                        })
                      }
                      className='w-20'
                      min='0'
                    />
                  ) : (
                    entry.quantity.toLocaleString()
                  )}
                </TableCell>
                <TableCell>
                  {editingId === entry.id ? (
                    <div className='flex items-center gap-1'>
                      <Input
                        type='number'
                        value={editValues.weightPerPiece}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            weightPerPiece: parseInt(e.target.value) || 0,
                          })
                        }
                        className='w-20'
                        min='0'
                      />
                      <span className='text-xs text-muted-foreground'>lbs</span>
                    </div>
                  ) : (
                    `${entry.weightPerPiece} lbs`
                  )}
                </TableCell>
                <TableCell>
                  {editingId === entry.id
                    ? `${(
                        editValues.quantity * editValues.weightPerPiece
                      ).toLocaleString()} lbs`
                    : `${entry.TotalWeight.toLocaleString()} lbs`}
                </TableCell>
                <TableCell className='text-right'>
                  {editingId === entry.id ? (
                    <div className='flex gap-1 justify-end'>
                      <Button
                        size='sm'
                        onClick={() => handleSave(entry.id)}
                        disabled={isPending}
                      >
                        <Save className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={handleCancel}
                        disabled={isPending}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ) : (
                    <div className='flex gap-1 justify-end'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleEdit(entry)}
                        disabled={isPending}
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => handleDelete(entry.id)}
                        disabled={isPending}
                        className='text-destructive hover:text-destructive/80 hover:bg-destructive/10'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
