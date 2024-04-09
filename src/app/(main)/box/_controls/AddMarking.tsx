import { Button } from '@/components/ui/button'
import useBoxControls from '../useBoxControls'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PlusIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Props {
  controls: ReturnType<typeof useBoxControls>
}

export default function AddMarking(props: Props) {
  const [label, setLabel] = useState('')
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(false)

  const addMarking = () => {
    if (label.trim() === '') return alert('Please enter a label')

    const added = props.controls.addMarking({
      label,
      value,
      transform: 'translate(0, 0)',
      id: props.controls.markings.length + 1,
    })
    if (added) setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => setOpen(o)}
    >
      <PopoverTrigger asChild>
        <Button
          className='mt-2'
          variant='secondary'
          size={'sm'}
        >
          <PlusIcon className='w-4 h-4 mr-1' />
          New Marking
        </Button>
      </PopoverTrigger>
      <PopoverContent className='mx-4'>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-[1fr_2fr] items-center gap-4'>
            <Label
              htmlFor='label'
              className='text-right'
            >
              Label
            </Label>
            <Input
              id='label'
              placeholder='Enter label'
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className='grid grid-cols-[1fr_2fr] items-center gap-4'>
            <Label
              htmlFor='value'
              className='text-right'
            >
              Initial Value
            </Label>
            <Input
              id='value'
              placeholder='Enter value'
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <Button onClick={addMarking}>Add</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
